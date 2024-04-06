import { Link } from "react-router-dom";

export default function Comment({ 
  id,
  username, 
  avatarUrl,
  content,
  displayDate,
  handleDelete 
}) {
  
  return (
    <li className="py-4 flex border-b">
      {/* User avatar */}
      <div className="shrink-0">
        <Link to={`/profiles/${username}`}>
          <img
            src={avatarUrl}
            className="w-8 h-8 object-cover border rounded-full"
          />
        </Link>
      </div>

      {/* Comment Content */}
      <div className="grow ml-4">
        <Link to={`/profiles/${username}`} className="font-semibold">
          {username} {" "}
        </Link>
        {content}
        <p>
          <small className="font-xs text-gray-400">{displayDate}</small>
        </p>
      </div>

      {/* Delete button */}
      <svg 
        className="h-2 cursor-pointer"
        onClick={() => handleDelete(id)}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 448 512"
      >
        <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
      </svg>
    </li>
  )
}
