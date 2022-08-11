import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';
import styles from './OAuth.module.css';

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Checks if User Exists or Not
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // Creates User if it doesn't exist
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate('/');
    } catch (err) {
      console.log(err.code);
      toast.error('Could not authorize with Google!');
    }
  };

  return (
    <div className={styles.container}>
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
      <button className={styles.googleButton} onClick={onGoogleClick}>
        <img src={googleIcon} alt='Google Icon' className={styles.googleImg} />
      </button>
    </div>
  );
};
export default OAuth;
