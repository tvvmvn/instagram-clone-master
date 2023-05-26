import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFollowings } from '../utils/requests';
import Spinner from './Spinner';

export default function FollowingList() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    getFollowings(username)
      .then(data => {
        setFollowingCount(data.profileCount);
        setFollowings([...followings, ...data.profiles]);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true))

  }, [])

  function handleFollow() { }
  function handleUnfollow() { }

  const followingList = followings.map(following => (
    <div key={following.username} className="flex justify-between items-center mb-2">
      {/* Profile Avatar */}
      <Link
        to={`/profiles/${following.username}`}
        className="inline-flex items-center"
      >
        <img
          src={`${process.env.REACT_APP_SERVER}/files/profiles/${following.avatar}`}
          className="w-12 h-12 object-cover rounded-full"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {following.username}
          </span>
          <span className="block text-gray-400 text-sm">
            {following.fullName}
          </span>
        </div>
      </Link>

      {/* Follow Button */}
      {following.isFollowing ? (
        <button
          className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
          onClick={handleUnfollow}
        >
          Following
        </button>
      ) : (
        <button
          className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
          onClick={handleFollow}
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