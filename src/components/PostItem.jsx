import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import styles from './PostItem.module.css';

const PostItem = ({ post, id }) => {
  console.log(post);

  return (
    <div className={styles.postDiv}>
      <div className={styles.profileDiv}>
        <div className={styles.profileImgDiv}>
          <img src={post.userImg} alt={post.userName} />
        </div>
        <p>{post.userName}</p>
      </div>

      <div className={styles.imgDiv}>
        <img src={post.imgUrl} alt={post.petName} />
      </div>

      <div className={styles.infoDiv}>
        <p>{post.petName}</p>
        <div>
          <p>{post.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
