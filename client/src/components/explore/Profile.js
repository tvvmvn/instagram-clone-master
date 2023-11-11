import { Link } from "react-router-dom"

export default function Profile({
    username,
    name,
    avatarUrl,
    isFollowing
}) {
  
  return (
    <li className="flex items-center justify-between my-2">
      <Link
        to={`/profiles/${username}`}
        className="flex items-center"
      >
        <img
          src={avatarUrl}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {username}
          </span>
          <span className="block text-gray-400 text-sm">
            {name}
          </span>
        </div>
      </Link>

      {isFollowing && (
        <div className="ml-2 text-sm text-blue-500 font-semibold">
          following
        </div>
      )}
    </li>
  )
}