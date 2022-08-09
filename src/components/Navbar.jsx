import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as UserIcon } from '../assets/svg/personIcon.svg';
import { ReactComponent as AddIcon } from '../assets/svg/addIcon2.svg';
import { ReactComponent as HomeIcon } from '../assets/svg/homeIcon.svg';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMatchRoute = route => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Petsagram</h1>

      <nav className={styles.navbar}>
        <ul className={styles.list}>
          <li className={styles.item} onClick={() => navigate('/')}>
            <HomeIcon
              className={styles.icon}
              fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p
              className={
                pathMatchRoute('/') ? `${styles.active}` : `${styles.name}`
              }
            >
              Home
            </p>
          </li>

          <li className={styles.item} onClick={() => navigate('/sign-in')}>
            <AddIcon
              className={styles.icon}
              fill={pathMatchRoute('/sign-in') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p
              className={
                pathMatchRoute('/sign-in')
                  ? `${styles.active}`
                  : `${styles.name}`
              }
            >
              Post
            </p>
          </li>

          <li className={styles.item} onClick={() => navigate('/profile')}>
            <UserIcon
              className={styles.icon}
              fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p
              className={
                pathMatchRoute('/profile')
                  ? `${styles.active}`
                  : `${styles.name}`
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
