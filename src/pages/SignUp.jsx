import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

import styles from './SignUp.module.css';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  // Changes the Value based on the input ID
  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async e => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <section className={styles.section}>
          <form className={styles.form} onSubmit={onSubmit}>
            <header>
              <h2 className={styles.header}>Sign Up Today!</h2>
            </header>
            <input
              type='text'
              className={styles.nameInput}
              placeholder='Name'
              id='name'
              value={name}
              onChange={onChange}
            />

            <input
              type='email'
              className={styles.emailInput}
              placeholder='Email'
              id='email'
              value={email}
              onChange={onChange}
            />

            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.passwordInput}
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />

            <div
              className={styles.visibleDiv}
              onClick={() => setShowPassword(prevState => !prevState)}
            >
              <img
                src={visibilityIcon}
                alt='Show Password'
                className={styles.visibleIcon}
              />
              <p className={styles.visibleText}>Show Password</p>
            </div>

            <div className={styles.signUp}>
              <button className={styles.signUpButton}>
                Sign Up
                <ArrowRightIcon fill='#fff' width='25px' height='25px' />
              </button>
            </div>

            {/* OAuth */}

            <div className={styles.linkDiv}>
              <Link to='/sign-in' className={styles.registerLink}>
                Sign In Instead
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default SignIn;
