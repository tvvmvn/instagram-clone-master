import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getComments, createComment, deleteComment } from "../../service/api";
import Form from "./Form";
import Comment from './Comment';
import Spinner from '../shared/Spinner';

export default function Comments() {

  const { id } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [comments, setComments] = useState([]);

  // key state
  console.log(comments)

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    try {
      const data = await getComments(id);

      setComments([...comments, ...data.comments]);

    } catch (error) {
      setError(error)
    } finally {
      setIsLoaded(true)
    }
  }

  async function handleAddComment(content) {
    const data = await createComment(id, content);

    const updatedComments = [data.comment, ...comments];
    setComments(updatedComments);
  }

  async function handleDelete(id) {
    await deleteComment(id);
    
    const remainingComments = comments.filter(comment => comment.id !== id);

    setComments(remainingComments);
  }

  const commentList = comments.map(comment => (
    <Comment
      key={comment.id}
      id={comment.id}
      username={comment.user.username}
      avatarUrl={comment.user.avatarUrl}
      content={comment.content}
      displayDate={comment.displayDate}
      handleDelete={handleDelete}
    />
  ))

  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold my-4">This post's comments</h3>
      
      <Form handleAddComment={handleAddComment} />

      {commentList.length > 0 ? (
        <ul>
          {commentList}
        </ul>
      ) : (
        <p className="text-center">This post has no comments.</p>
      )}

      {!isLoaded && <Spinner />}
      
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}

