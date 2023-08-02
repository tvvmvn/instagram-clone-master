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
    <div key={followingUser.username} className="flex justify-between items-center mb-2">
      {/* Profile Avatar */}
      <Link
        to={`/profiles/${followingUser.username}`}
        className="inline-flex items-center"
      >
        <img
          src={`${process.env.REACT_APP_SERVER}/files/avatar/${followingUser.avatar}`}
          className="w-12 h-12 object-cover rounded-full border"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {followingUser.username}
          </span>
          <span className="block text-gray-400 text-sm">
            {followingUser.fullName}
          </span>
        </div>
      </Link>

      {/* Follow Button */}
      {followingUser.isFollowing ? (
        <button
          className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
          onClick={() => handleUnfollow(followingUser.username)}
        >
          Following
        </button>
      ) : (
        <button
          className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
          onClick={() => handleFollow(followingUser.username)}
        >
          Follow
        </button>
      )}
    </div>
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