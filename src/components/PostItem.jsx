import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import shareIcon from '../assets/svg/shareIcon.svg';
import styles from './PostItem.module.css';

const PostItem = ({ post, id, onDelete, onEdit }) => {
  console.log(post);

  return (
    <div className={styles.postDiv}>
      <div className={styles.profileDiv}>
        <div className={styles.userInfo}>
          <div className={styles.profileImgDiv}>
            <img src={post.userImg} alt={post.userName} />
          </div>
          <p className={styles.profileName}>{post.userName}</p>
        </div>

        <div>
          <img src={shareIcon} alt='share icon' className={styles.postIcon} />

          {onEdit && (
            <EditIcon
              className={styles.postIcon}
              fill='#009688'
              onClick={() => onEdit(id)}
            />
          )}

          {onDelete && (
            <DeleteIcon
              className={styles.postIcon}
              fill='#D32F2F'
              onClick={() => onDelete(post.id, post.name)}
            />
          )}
        </div>
      </div>

      <div
        className={styles.imgDiv}
        style={{ backgroundImage: `url(${post.imgUrl})` }}
      ></div>

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
