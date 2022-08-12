import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.container}>
      <Link to='/' className={styles.titleLink}>
        Petsagram
      </Link>
    </div>
  );
};

export default Header;
