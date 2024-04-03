import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

export default function ProfileItem({
  username,
  avatarUrl,
  name,
  isFollowing,
  handleFollow,
  handleUnfollow
}) {

  const { user } = useContext(AuthContext);
  const isMaster = username === user.username;

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
          <h3 className="block font-semibold">
            {username}
          </h3>
          <span className="block text-gray-400 text-sm">
            {name}
          </span>
        </div>
      </Link>

      {/* Follow / Unfollow button */}
      {!isMaster && (
        isFollowing ? (
          <button
            className="bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
            onClick={() => handleUnfollow(username)}
          >
            Following
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
            onClick={() => handleFollow(username)}
          >
            Follow
          </button>
        )
      )}
    </li>
  )
}