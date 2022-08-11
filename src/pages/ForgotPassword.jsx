import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import { toast } from 'react-toastify';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const onChange = e => setEmail(e.target.value);

  const onSubmit = async e => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success(
        'Reset Email was sent! Please check your Inbox or Spam mail folder.'
      );
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          return toast.error('This user does not exist!');

        default:
          return toast.error('An error has occurred, please try again!');
      }
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <form className={styles.form} onSubmit={onSubmit}>
          <header>
            <h2 className={styles.header}>Forgot Password</h2>
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

          <div className={styles.links}>
            <div>
              <button className={styles.resendButton}>
                Send Resend Link
                <ArrowRightIcon fill='#fff' width='25px' height='25px' />
              </button>
            </div>

            <Link className={styles.signInLink} to='/sign-in'>
              Sign In
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ForgotPassword;
