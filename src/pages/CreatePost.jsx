import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import styles from './CreatePost.module.css';

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    petImg: {},
    userImg: '',
    petName: '',
    userName: '',
  });

  const { description, petImg, petName } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, user => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
            userName: auth.currentUser.displayName,
            userImg: auth.currentUser.photoURL,
          });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async e => {
    e.preventDefault();

    // Stores Image in Firebase
    const storeImage = async image => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'images/' + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          error => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrl = await storeImage(petImg[0]);

    const formDataCopy = {
      ...formData,
      imgUrl,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.petImg;

    await addDoc(collection(db, 'posts'), formDataCopy);

    // setLoading(false)
    toast.success('Post Created!');
    navigate('/');
  };

  const onMutate = e => {
    // Files
    if (e.target.files) {
      setFormData(prevState => ({
        ...prevState,
        petImg: e.target.files,
      }));
    }

    // Text
    if (!e.target.files) {
      setFormData(prevState => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <header>
          <p className={styles.pageHeader}>Create a Post</p>
        </header>

        <form onSubmit={onSubmit}>
          <label className={styles.formLabel}>Pet Name</label>
          <input
            className={styles.nameInput}
            type='text'
            id='petName'
            value={petName}
            onChange={onMutate}
            required
          />

          <label className={styles.formLabel}>Description</label>
          <textarea
            className={styles.descriptionInput}
            type='text'
            id='description'
            value={description}
            onChange={onMutate}
            required
          />

          <label className={styles.formLabel}>Image</label>
          <p className={styles.fileText}>Must be at least 2MB or less!</p>
          <input
            className={styles.fileInput}
            type='file'
            id='image'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />

          <div className={styles.buttonDiv}>
            <button type='submit' className={styles.formButton}>
              Create Post
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreatePost;
