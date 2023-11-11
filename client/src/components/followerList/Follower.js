import { useContext } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../auth/AuthContext";

export default function Follower({
  username,
  name,
  avatarUrl,
  isFollowing,
  handleFollow, 
  handleUnfollow 
}) {

  const { user } = useContext(AuthContext);
  const isMaster = username === user.username;

  const followButton = (
    <button
      className="bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
      onClick={() => handleFollow(username)}
    >
      Follow
    </button>
  )

  const unfollowButton = (
    <button
      className="bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
      onClick={() => handleUnfollow(username)}
    >
      Following
    </button>
  )

  return (
    <li className="flex justify-between items-center mb-2">
      {/* Profile */}
      <Link
        to={`/profiles/${username}`}
        className="inline-flex items-center"
      >
        <img
          src={avatarUrl}
          className="w-12 h-12 object-cover rounded-full border"
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

      {!isMaster && (
        isFollowing ? unfollowButton : followButton
      )}
    </li>
  )
}