import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as UserIcon } from '../assets/svg/personIcon.svg';
import { ReactComponent as AddIcon } from '../assets/svg/addIcon.svg';
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
      <Link to='/' className={styles.title}>
        Petsagram
      </Link>

      <nav className={styles.navbar}>
        <ul className={styles.list}>
          <li
            className={
              pathMatchRoute('/') ? `${styles.itemActive}` : `${styles.item}`
            }
            onClick={() => navigate('/')}
          >
            <HomeIcon
              className={styles.icon}
              fill={pathMatchRoute('/') ? '#fff' : '#8f8f8f'}
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

          <li
            className={
              pathMatchRoute('/create-post')
                ? `${styles.itemActive}`
                : `${styles.item}`
            }
            onClick={() => navigate('/create-post')}
          >
            <AddIcon
              className={styles.icon}
              fill={pathMatchRoute('/create-post') ? '#fff' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p
              className={
                pathMatchRoute('/create-post')
                  ? `${styles.active}`
                  : `${styles.name}`
              }
            >
              Post
            </p>
          </li>

          <li
            className={
              pathMatchRoute('/profile')
                ? `${styles.itemActive}`
                : `${styles.item}`
            }
            onClick={() => navigate('/profile')}
          >
            <UserIcon
              className={styles.icon}
              fill={pathMatchRoute('/profile') ? '#fff' : '#8f8f8f'}
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

      {/* Dark Mode will be added here */}
      <div className={styles.whiteSpace}>&nbsp;</div>
    </div>
  );
};

export default Navbar;
