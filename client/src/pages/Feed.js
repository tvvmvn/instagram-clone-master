import { useState, useEffect, useContext } from "react"
import PostTemplate from "./common/PostTemplate";
import { getFeed, deletePost, likePost, unlikePost } from "../service/api";
import Spinner from './common/Spinner';
import AuthContext from "../auth/AuthContext";

const limit = 5;

export default function Feed() {
  
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const { user } = useContext(AuthContext)

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
    <PostTemplate
      key={post.id}
      id={post.id}
      username={post.user.username}
      avatarUrl={post.user.avatarUrl}
      photoUrls={post.photoUrls}
      caption={post.caption}
      liked={post.liked}
      likesCount={post.likesCount}
      commentCount={post.commentCount}
      displayDate={post.displayDate}
      handleLike={handleLike}
      handleUnlike={handleUnlike}
      handleDelete={handleDelete}
      isMaster={user.username === post.user.username}
    />
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

