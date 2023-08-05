import {useState, useEffect, useContext} from "react"
import PostTemplate from "./PostTemplate";
import { getFeed, deletePost, likePost, unlikePost } from "../utils/requests";
import Spinner from './Spinner';

const limit = 5;

export default function Feed() {
  
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [postCount, setPostCount] = useState(0);

  console.log(posts)

  useEffect(() => {
    setError(null);
    setIsLoaded(false);
    
    getFeed(skip)
      .then(data => {
        setPostCount(data.postCount);
          
        let updatedPosts = [...posts, ...data.posts];
        setPosts(updatedPosts);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true))
      
  }, [skip])

  async function handleLike(id) {
    try {
      await likePost(id);

      const updatedPosts = posts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            liked: true,
            likesCount: post.likesCount + 1
          }
        }
        return post;
      })
  
      setPosts(updatedPosts);

    } catch (error) {
      alert(error)
    }
  }

  async function handleUnlike(id) {
    try {
      await unlikePost(id)

      const updatedPosts = posts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            liked: false,
            likesCount: post.likesCount - 1
          }
        }
        return post;
      })
  
      setPosts(updatedPosts);

    } catch (error) {
      alert(error)
    }
  }

  async function handleDelete(id) {
    try {
      await deletePost(id); 

      const remainingPosts = posts.filter(post => {
        if (id !== post.id) {
          return post;
        }
      });
  
      setPosts(remainingPosts);
    
    } catch (error) {
      alert(error)
    }
  }

  const postList = posts.map(post => (
    <li key={post.id} className="border-b pb-4">
      <PostTemplate
        post={post}
        handleLike={handleLike}
        handleUnlike={handleUnlike}
        handleDelete={handleDelete}
      />
    </li>
  ))

  const doesMoreExists = postCount > limit && postCount > posts.length;

  const moreButton = doesMoreExists && (
    <div className="flex justify-center my-2">
      <button 
        className="p-1 text-blue-500 font-semibold" 
        onClick={() => setSkip(skip + limit)}
      >
        More
      </button>
    </div>
  )

  return (
    <>
      <ul>
        {postList}
      </ul>

      {isLoaded ? moreButton : <Spinner />}

      {error && <p className="text-red-500">{error.message}</p>}
    </>  
  )
}

