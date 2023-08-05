import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFollowingUsers, follow, unfollow } from '../utils/requests';
import Spinner from './Spinner';

export default function FollowingList() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);

  console.log(followingUsers)

  useEffect(() => {
    getFollowingUsers(username)
      .then(data => {
        setFollowingCount(data.profileCount);
        setFollowingUsers([...followingUsers, ...data.profiles]);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true))
  }, [])

  async function handleFollow(username) {
    try {
      await follow(username)

      const updatedFollowingUsers = followingUsers.map(followingUser => {
        if (followingUser.username === username) {
          return { ...followingUser, isFollowing: true }
        }

        return followingUser;
      })

      setFollowingUsers(updatedFollowingUsers);

    } catch (error) {
      alert(error)
    }
  }

  async function handleUnfollow(username) {
    try {
      await unfollow(username)

      const updatedFollowingUsers = followingUsers.map(followingUser => {
        if (followingUser.username === username) {
          return { ...followingUser, isFollowing: false }
        }

        return followingUser;
      })

      setFollowingUsers(updatedFollowingUsers);

    } catch (error) {
      alert(error)
    }
  }

  const followingList = followingUsers.map(followingUser => (
    <FollowingUser 
      key={followingUser.id}
      username={followingUser.username}
      name={followingUser.name}
      isFollowing={followingUser.isFollowing}
      avatarUrl={followingUser.avatarUrl}
      handleFollow={handleFollow}
      handleUnfollow={handleUnfollow}
    />
  ))

  return (
    <div className="px-2">
      <h3 className="text-lg my-4 font-semibold">{username}'s following</h3>
      <ul>
        {followingList}
      </ul>

      {!isLoaded && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}

function FollowingUser({ 
  username,
  name,
  isFollowing,
  avatarUrl,
  handleFollow, 
  handleUnfollow 
}) {

  const followButton = (
    <button
      className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
      onClick={() => handleFollow(username)}
    >
      Follow
    </button>
  )

  const unfollowButton = (
    <button
      className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
      onClick={() => handleUnfollow(username)}
    >
      Following
    </button>
  )

  return (
    <div className="flex justify-between items-center mb-2">
      {/* Profile Avatar */}
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

      {/* Follow Button */}
      {isFollowing ? unfollowButton : followButton}
    </div>
  )
}