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
    <li className="py-4 flex">
      {/* User avatar */}
      <Link to={`/profiles/${username}`} className="flex-none">
        <img
          src={avatarUrl}
          className="w-8 h-8 object-cover border rounded-full"
        />
      </Link>

      {/* Comment Content */}
      <div className="grow ml-4">
        <p>
          <Link to={`/profiles/${username}`} className="font-semibold">
            {username} {" "}
          </Link>
          <span>
            {content}
          </span>
        </p>
        <small className="mt-2 block font-xs text-gray-400">
          {displayDate}
        </small>
      </div>

      {/* Delete button */}
      <FaMinus 
        size="8" 
        className="flex-none cursor-pointer"
        onClick={() => handleDelete(id)}
      />
    </li>
  )
}
