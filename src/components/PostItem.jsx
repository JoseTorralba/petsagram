import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
// import shareIcon from '../assets/svg/shareIcon.svg';
import styles from './PostItem.module.css';
import defaultAvatar from '../assets/img/avatar.png';

const PostItem = ({ post, id, onDelete, onEdit }) => {
  const years = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className={styles.postDiv}>
      <div className={styles.profileDiv}>
        <div className={styles.userInfo}>
          <div
            className={styles.profileImgDiv}
            style={{
              backgroundImage: `${
                null ? `url(${defaultAvatar})` : `url(${post.userImg})`
              }`,
            }}
          ></div>
          <p className={styles.profileName}>{post.userName}</p>
        </div>

        <div>
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

      <div className={styles.imgDiv}>
        <img className={styles.img} src={post.imgUrl} alt='post' />
      </div>

      <div className={styles.infoDiv}>
        <p className={styles.infoName}>{post.petName}</p>
        <div className={styles.infoDesc}>
          <p className={styles.infoText}>{post.description}</p>

          <p className={styles.infoDate}>
            {years[post.timestamp.toDate().getMonth()]}{' '}
            {post.timestamp.toDate().getDate()}
            {', '}
            {post.timestamp.toDate().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
