import { Link } from 'react-router-dom';
import styles from './Welcome.module.css';

const Welcome = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Petsagram</h1>
          <h2 className={styles.subTitle}>
            Share your furry friend to the world!
          </h2>

          <div className={styles.buttons}>
            <Link to='/sign-in' className={styles.buttonMain}>
              Log In
            </Link>

            <Link to='/sign-up' className={styles.buttonSub}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
