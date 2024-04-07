import { Link } from "react-router-dom";
import { FaMinus } from "react-icons/fa6";

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
      <FaMinus size="8" onClick={() => handleDelete(id)}/>
    </li>
  )
}
