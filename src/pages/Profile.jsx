import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase.config';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';

import PostItem from '../components/PostItem';
import Loading from '../components/Loading';
import styles from './Profile.module.css';

import { toast } from 'react-toastify';

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [posts, setPosts] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
  );
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
  });
  const { name } = formData;

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Fetches Current User Post
  useEffect(() => {
    const fetchUserPosts = async () => {
      const postsRef = collection(db, 'posts');

      const q = query(
        postsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);

      const posts = [];

      querySnap.forEach(doc => {
        return posts.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setPosts(posts);
      setLoading(false);
    };

    fetchUserPosts();
  }, [auth.currentUser.uid]);

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Fetches Current User Profile Image
  useEffect(() => {
    if (auth.currentUser?.photoURL) {
      setPhotoURL(auth.currentUser.photoURL);
    }
  }, [auth.currentUser]);

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Updates Display Name in Firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (err) {
      toast.error('Could not update profile details, please try again!');
    }
  };

  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Gets File Data from file Input
  const handleImgChange = e => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setDisabled(false);
    }
  };

  // Add a Loading Spinner
  const imgUpdate = async () => {
    try {
      setLoading(true);
      const storage = getStorage();
      const fileRef = ref(storage, auth.currentUser.uid + '.png');
      await uploadBytes(fileRef, photo);
      const photoURL = await getDownloadURL(fileRef);

      updateProfile(auth.currentUser, { photoURL });

      setLoading(false);
      toast.success(
        'Image uploaded! Changes may take a few minutes to display.'
      );
    } catch (err) {
      toast.error('Image must be at least 2MB or less!');
      setLoading(false);
    }
  };

  // Deletes Post
  const onDelete = async postId => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'posts', postId));
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      toast.success('Post successfully deleted!');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.headerTitle}>My Profile</p>
        <button
          type='button'
          className={styles.logoutButton}
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <div className={styles.detailsHeading}>
        <p
          className={styles.detailsChange}
          onClick={() => {
            changeDetails && onSubmit();
            setChangeDetails(prevState => !prevState);
          }}
        >
          {changeDetails ? 'Save Changes' : 'Edit Profile'}
        </p>
      </div>

      {/* Image and Name */}
      <main className={styles.profile}>
        <div
          className={styles.profileImgDiv}
          style={{
            backgroundImage: `url(${
              photoURL ? photoURL : auth.currentUser.photoURL
            })`,
          }}
        ></div>

        {changeDetails && (
          <div className={styles.changeImgDiv}>
            <p className={styles.changeImgText}>Change Profile Image</p>
            <p className={styles.changeImgSubText}>
              Must be at least 2MB or less!
            </p>
            <input
              className={styles.changeImgInput}
              type='file'
              onChange={handleImgChange}
            />

            <button
              onClick={imgUpdate}
              className={styles.uploadButton}
              disabled={disabled}
            >
              Upload
            </button>
          </div>
        )}

        <div>
          <form>
            {changeDetails && <p className={styles.editName}>Edit Name:</p>}
            <input
              type='text'
              id='name'
              className={
                !changeDetails
                  ? `${styles.profileName}`
                  : `${styles.profileNameActive}`
              }
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
          </form>
        </div>

        {!loading && posts?.length > 0 && (
          <>
            <h3 className={styles.postHeader}>Your Posts</h3>

            <div className={styles.grid}>
              {posts.map(post => (
                <PostItem
                  post={post.data}
                  onDelete={() => onDelete(post.id)}
                  // onEdit={() => onEdit(post.id)}
                  id={post.id}
                  key={post.id}
                />
              ))}
            </div>
          </>
        )}

        {!changeDetails && (
          <div className={styles.uploadDiv}>
            <Link to='/create-post' className={styles.uploadPost}>
              Upload an Image
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
