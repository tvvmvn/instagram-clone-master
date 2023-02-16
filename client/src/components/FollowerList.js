import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFollowers, followReq } from '../utils/requests';
import AuthContext from './AuthContext';
import Spinner from './Spinner';

export default function FollowerList() {

  const { user } = useContext(AuthContext);
  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0)

  useEffect(() => {
    fetchFollowers(username)
      .then(data => {
        setFollowerCount(data.userCount);
        setFollowers([...followers, ...data.users]);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));
  }, [])

  async function handleFollow(username, isFollowing) {
    try {
      await followReq(username, isFollowing);

      const updatedFollowers = followers.map(follower => {
        if (follower.username === username) {
          return { ...follower, isFollowing: !follower.isFollowing }
        }
        return follower;
      })

      setFollowers(updatedFollowers);

    } catch (error) {
      alert(error)
    }
  }

  const followerList = followers.map(follower => (
    <div
      key={follower.username}
      className="flex items-center"
    >
      <Link
        to={`/profiles/${follower.username}`}
        className="inline-flex items-center"
      >
        <img
          src={`${process.env.REACT_APP_SERVER}/files/profiles/${follower.image}`}
          className="w-12 h-12 object-cover rounded-full"
        />
        <span className="ml-2">
          {follower.username}
        </span>
      </Link>

      {user.username !== follower.username && (
        <div className="ml-2">
          <button
            className={`px-4 py-2 text-sm rounded-lg font-semibold ${follower.isFollowing ? 'bg-gray-200' : 'text-white bg-blue-500'}`}
            onClick={() => handleFollow(follower.username, follower.isFollowing)}
          >
            {follower.isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      )}

    </div>
  ))

  return (
    <div className="px-2">
      <h1 className="text-2xl my-4 font-semibold">Followers</h1>
      {followerCount > 0 ? (
        <ul>
          {followerList}
        </ul>
      ) : (
        <p className="text-center my-4">User has no followers</p>
      )}

      {!isLoaded && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}