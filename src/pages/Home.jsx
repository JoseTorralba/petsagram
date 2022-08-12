import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

import Loading from '../components/Loading';
import PostItem from '../components/PostItem';
import styles from './Home.module.css';

const Home = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Gets Reference
        const postsRef = collection(db, 'posts');

        // Create Query
        const q = query(postsRef, orderBy('timestamp', 'desc'), limit(6));

        // Executes Query
        const querySnap = await getDocs(q);

        const posts = [];

        querySnap.forEach(doc => {
          return posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setPosts(posts);
        setLoading(false);
      } catch (err) {
        toast.error('Could not fetch Posts!');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {posts.map(post => (
              <PostItem post={post.data} id={post.id} key={post.id} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
