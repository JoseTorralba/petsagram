import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { toast } from 'react-toastify';
import styles from './SignIn.module.css';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate('/');
      }

      // Auth Error Handler
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          return toast.error('This user does not exist!');

        case 'auth/wrong-password':
          return toast.error('Wrong password! Please try again.');

        default:
          return toast.error('An error has occurred, please try again!');
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <section className={styles.section}>
          <form className={styles.form} onSubmit={onSubmit}>
            <header>
              <h2 className={styles.header}>Welcome Back!</h2>
            </header>
            <input
              type='email'
              className={styles.emailInput}
              placeholder='Email'
              id='email'
              value={email}
              onChange={onChange}
              required
            />

            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.passwordInput}
                placeholder='Password'
                id='password'
                value={password}
                onChange={onChange}
              />
            </div>

            <div className={styles.passwordOptions}>
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

              <Link to='/forgot-password' className={styles.forgotPassword}>
                Forgot Password
              </Link>
            </div>

            <div className={styles.signUp}>
              <button className={styles.signUpButton}>
                Sign In
                <ArrowRightIcon fill='#fff' width='25px' height='25px' />
              </button>
            </div>

            {/* OAuth */}
            <div className={styles.linkDiv}>
              <Link to='/sign-up' className={styles.registerLink}>
                Sign Up Instead
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default SignIn;
