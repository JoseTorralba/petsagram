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
        const q = query(postsRef, orderBy('timestamp', 'desc'), limit(10));

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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {posts.map(post => (
            <p key={post.id}>{post.data.petName}</p>
          ))}
        </>
      )}
    </div>
  );
};

export default Home;
