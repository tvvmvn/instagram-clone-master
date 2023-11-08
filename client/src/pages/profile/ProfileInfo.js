import { Link } from "react-router-dom"

export default function ProfileInfo({
  username,
  avatarUrl,
  name, 
  bio,
  postCount,
  followerCount,
  followingCount,
  isFollowing,
  handleSignOut,
  handleFollow,
  handleUnfollow,
  isMaster,
}) {

  const signOutButton = (
    <button
      className="ml-2 bg-gray-200 px-4 py-2 text-sm font-semibold rounded-lg"
      onClick={handleSignOut}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="w-4"
      >
        <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
      </svg>
    </button>
  )

  const followButton = (
    <button
      className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
      onClick={handleFollow}
    >
      Follow
    </button>
  )

  const unfollowButton = (
    <button
      className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
      onClick={handleUnfollow}
    >
      Following
    </button>
  )

  // count for photos, followers, following
  const countAboutProfile = (
    <ul className="flex items-center">
      <li className="w-1/3">
        <div className="text-sm">
          <span className="font-semibold">
            {postCount}
          </span>
          {" "}
          photos
        </div>
      </li>
      <li className="w-1/3">
        <Link to={`/profiles/${username}/followers`} className="block text-sm">
          <span className="font-semibold">
            {followerCount}
          </span>
          {" "}
          followers
        </Link>
      </li>
      <li className="w-1/3">
        <Link to={`/profiles/${username}/following`} className="block text-sm">
          <span className="font-semibold">
            {followingCount}
          </span>
          {" "}
          following
        </Link>
      </li>
    </ul>
  )

  return (
    <div className="px-4 mt-8">
      <div className="flex mb-4">
        {/* Avatar image */}
        <img
          src={avatarUrl}
          className="w-20 h-20 object-cover border rounded-full"
        />

        {/* Profile info */}
        <div className="grow ml-4">
          <div className="flex items-center mb-4">
            <h3>{username}</h3>

            {isMaster && (
              <div className="flex ml-2">
                <Link to="/accounts/edit" className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-semibold">
                  Edit profile
                </Link>

                {signOutButton}
              </div>
            )}

            {(!isMaster && !isFollowing) && followButton}
            {(!isMaster && isFollowing) && unfollowButton}
          </div>

          {countAboutProfile}
        </div>
      </div>

      {/* Name and bio */}
      <div>
        {name && (
          <h3 className="text-sm font-semibold my-2">
            {name}
          </h3>
        )}

        {bio && (
          <p className="text-sm my-2 whitespace-pre-line">
            {bio}
          </p>
        )}
      </div>
    </div>
  )
}