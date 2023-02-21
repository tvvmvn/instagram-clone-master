import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFollowings } from '../utils/requests';
import Spinner from './Spinner';

export default function FollowingList() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    fetchFollowings(username)
      .then(data => {
        setFollowingCount(data.userCount);
        setFollowings([...followings, ...data.users]);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true))

  }, [])

  const followingList = followings.map(following => (
    <Link
      key={following.username}
      to={`/profiles/${following.username}`}
      className="flex items-center mb-2"
    >
      <img
        src={`${process.env.REACT_APP_SERVER}/files/profiles/${following.image}`}
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
  ))

  return (
    <div className="px-2">
      <h1 className="text-2xl my-4 font-semibold">Following</h1>
      {followingCount > 0 ? (
        <ul>
          {followingList}
        </ul>
      ) : (
        <p className="text-center my-4">User doesn't follow any users</p>
      )}

      {!isLoaded && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}