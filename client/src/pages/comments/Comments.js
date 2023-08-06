import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getComments, createComment, deleteComment } from "../../service/api";
import Form from "./Form";
import Comment from './Comment';
import Spinner from '../common/Spinner';

export default function Comments() {

  const { id } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  console.log(comments)

  useEffect(() => {
    getComments(id)
      .then(data => {
        setComments([...comments, ...data.comments]);
        setCommentCount(data.commentCount);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));
  }, [])

  async function handleAddComment(content) {
    const data = await createComment(id, content);

    setCommentCount(commentCount + 1);
  
    const updatedComments = [data.comment, ...comments];
    setComments(updatedComments);
  }

  async function handleDelete(id) {
    await deleteComment(id);
    
    const remainingComments = comments.filter(comment => comment.id !== id);

    setComments(remainingComments);
    setCommentCount(commentCount - 1);
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

      {commentCount > 0 ? (
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
