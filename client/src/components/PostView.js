import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostTemplate from "./PostTemplate";
import { getPost, deletePost, likePost, unlikePost } from "../utils/requests";
import Spinner from "./Spinner";

export default function PostView() {

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  console.log(post);

  useEffect(() => {
    getPost(id)
      .then(data => {
        setPost(data.post);
      })
      .catch(error => {
        navigate('/notfound', { replace: true });
      })
  }, [])

  async function handleLike(id) {
    try {
      await likePost(id)

      const updatedPost = {
        ...post,
        liked: true,
        likesCount: post.likesCount + 1
      }

      setPost(updatedPost);

    } catch (error) {
      alert(error)
    }
  }

  async function handleUnlike(id) {
    try {

      await unlikePost(id);

      const updatedPost = {
        ...post,
        liked: false,
        likesCount: post.likesCount - 1
      }

      setPost(updatedPost);
    
    } catch (error) {
      alert(error)
    }
  }

  async function handleDelete(id) {
    try {
      await deletePost(id);
      
      navigate('/', { replace: true });
    
    } catch (error) {
      alert(error)
    }
  }

  if (!post) {
    return <Spinner />
  }

  return (
    <PostTemplate
      post={post}
      handleLike={handleLike}
      handleUnlike={handleUnlike}
      handleDelete={handleDelete}
    />
  )
}


