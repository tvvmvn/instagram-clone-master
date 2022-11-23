import {useContext, useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import AuthContext from "./AuthContext";
import Modal from "./Modal";
import Avatar from "./Avatar";
import fetchData from "./fetchData";

export default function Comments() {
  const {articleId} = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchData(`${process.env.REACT_APP_HOSTNAME}/articles/${articleId}/comments`)
    .then(data => {
      setComments(data)
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [])
  
  function createComment(text, setText) {
    const formData = JSON.stringify({ content: text });

    fetch(`${process.env.REACT_APP_HOSTNAME}/articles/${articleId}/comments`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    .then(newComment => {
      setComments([newComment, ...comments])
      setText("")
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  function deleteComment(commentId) {
    fetch(`${process.env.REACT_APP_HOSTNAME}/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const updatedComments = comments.filter(comment => comment._id !== commentId);
      setComments(updatedComments);
    })
    .catch(error => {
      alert("Something's broken");
    })
  }

  function unfavorite(commentId) {
    fetch(`${process.env.REACT_APP_HOSTNAME}/comments/${commentId}/favorite`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedCommentList = comments.map(comment => {
        if (commentId === comment._id) {
          return {...comment, isFavorite: false, favoriteCount: comment.favoriteCount - 1}
        }
        return comment;
      })
      setComments(editedCommentList);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  function favorite(commentId) {
    fetch(`${process.env.REACT_APP_HOSTNAME}/comments/${commentId}/favorite`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedCommentList = comments.map(comment => {
        if (commentId === comment._id) {
          return {...comment, isFavorite: true, favoriteCount: comment.favoriteCount + 1}
        }
        return comment;
      })
      setComments(editedCommentList);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  const commentList = comments.map(comment => (
    <Comment
      key={comment._id}
      comment={comment} 
      favorite={favorite}
      unfavorite={unfavorite}
      deleteComment={deleteComment} 
    />
  ))

  return (
    <div className="px-2">
      <Form createComment={createComment} />

      <ul>
        {commentList} 
      </ul>

      {!isLoaded && <p>fetching comments...</p>}
      {error && <p>failed to fetch comments</p>}
    </div>  
  )
}

function Form({createComment}) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    createComment(text, setText);
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  return(
    <form onSubmit={handleSubmit} className="mb-3">
      <textarea 
        rows="3"
        className="border w-full px-2 py-1"
        value={text} 
        onChange={handleChange} 
      />
      <button 
        type="submit" 
        className="px-2 border border-black disabled:opacity-[0.2]" 
        disabled={!text.trim()}
      >
        Submit
      </button>
    </form>  
  )
}
  
function Comment({comment, favorite, unfavorite, deleteComment}) {
  const auth = useContext(AuthContext);
  const isMaster = auth.user.username === comment.user.username;

  const modal = (
    <Modal>
      <li className="border-b">
        <button
          className="w-full p-1"
          onClick={() => deleteComment(comment._id)}
        >
          Delete
        </button>
      </li>
    </Modal>
  )

  const created = new Date(comment.created).toLocaleDateString();

  return (
    <li className="mb-4 border-b">
      <div className="flex justify-between items-center">
        <Avatar user={comment.user} />
        {isMaster && modal}
      </div>

      <p className="mb-4">{comment.content}</p>
      
      <div className="flex">
        {comment.isFavorite ? (
          <button onClick={() => unfavorite(comment._id)}>
            <svg class="w-3 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"/>
            </svg>
          </button>
        ) : (
          <button onClick={() => favorite(comment._id)}>
            <svg class="w-3" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"/>
            </svg>
          </button>
        )}
        <div className="ml-1 text-xs">{comment.favoriteCount} likes</div>
      </div>

      <small className="font-xs text-gray-400">{created}</small>
    </li>  
  )
}
