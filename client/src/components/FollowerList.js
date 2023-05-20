import { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFollowers } from '../utils/requests';
import Spinner from './Spinner';

export default function FollowerList() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {

    getFollowers(username)
      .then(data => {
        setFollowerCount(data.profileCount);
        setFollowers([...followers, ...data.profiles]);
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => setIsLoaded(true));

  }, [])

  console.log(followers)

  function handleFollow() { }
  function handleUnfollow() { }

  const followerList = followers.map(follower => (
    <div key={follower.username} className="flex justify-between items-center mb-2">
      <Link
        to={`/profiles/${follower.username}`}
        className="inline-flex items-center"
      >
        <img
          src={`${process.env.REACT_APP_SERVER}/files/profiles/${follower.avatar}`}
          className="w-12 h-12 object-cover rounded-full"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {follower.username}
          </span>
          <span className="block text-gray-400 text-sm">
            {follower.fullName}
          </span>
        </div>
      </Link>
        {follower.follow ? (
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
      <h3 className="text-lg my-4 font-semibold">{username}'s followers</h3>
      <ul>
        {followerList}
      </ul>

      {!isLoaded && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}