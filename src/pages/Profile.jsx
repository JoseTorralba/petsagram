import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Link, useNavigate } from 'react-router-dom';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

import styles from './Profile.module.css';

function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
  });
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
  );

  console.log(auth.currentUser);
  const { name } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update Display Name in Firebase
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
    }
  };

  // Add a Loading Spinner
  const imgUpdate = async () => {
    console.log('Image will update');

    try {
      const storage = getStorage();

      const fileRef = ref(storage, auth.currentUser.uid + '.png');

      await uploadBytes(fileRef, photo);
      const photoURL = await getDownloadURL(fileRef);

      updateProfile(auth.currentUser, { photoURL });

      toast.success(
        'Image uploaded! Changes may take a few minutes to display.'
      );
    } catch (err) {
      toast.error('Image must be at least 2MB or less!');
    }
  };

  useEffect(() => {
    if (auth.currentUser?.photoURL) {
      setPhotoURL(auth.currentUser.photoURL);
    }
  }, [auth.currentUser]);

  return (
    <div className={styles.container}>
      <header className={styles.profileHeader}>
        <p className={styles.pageHeader}>My Profile</p>
        <button
          type='button'
          className={styles.logoutButton}
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      {/* Header Containing Change Button */}
      <div className={styles.detailsHeading}>
        <p
          className={styles.detailsChange}
          onClick={() => {
            changeDetails && onSubmit();
            setChangeDetails(prevState => !prevState);
          }}
        >
          {changeDetails ? 'Finish Editing' : 'Edit Profile'}
        </p>
      </div>

      {/* Image and Name */}
      <main className={styles.profile}>
        <div className={styles.imgDiv}>
          <img
            src={photoURL ? photoURL : auth.currentUser.photoURL}
            alt='Profile Avatar'
            className={styles.img}
          />
        </div>

        {changeDetails && (
          <div>
            <p className={styles.changeImgText}>Change Profile Image</p>
            <input
              className={styles.changeImgInput}
              type='file'
              onChange={handleImgChange}
            />
            <button onClick={imgUpdate} className={styles.uploadButton}>
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

        <Link to='/create-post'>
          <p>Upload an image of your pet!</p>
        </Link>
      </main>
    </div>
  );
}

export default Profile;
