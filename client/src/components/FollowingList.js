import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import User from './User';
import { fetchFollowings, followReq } from '../utils/requests';
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
        console.log(data)
        setFollowingCount(data.userCount);
        setFollowings([...followings, ...data.users]);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true))

  }, [])

  async function handleFollow(username, isFollowing) {
    try {
      await followReq(username, isFollowing);

      const updatedFollowings = followings.map(following => {
        if (following.username === username) {
          return {...following, isFollowing: !following.isFollowing}
        }
        return following;
      })
  
      setFollowings(updatedFollowings);
      
    } catch (error) {
      alert(error)
    }
  }

  const followingList = followings.map(following => (
    <div 
      key={following.username}
      className="flex" 
    >
      <User user={following} />
      <button 
        className={`ml-2 font-semibold ${!following.isFollowing && 'text-blue-500'}`}
        onClick={() => handleFollow(following.username, following.isFollowing)}
      >
        {following.isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  ))

  return (
    <div className="px-2">
      <h1 className="text-2xl my-4 font-semibold">Following</h1>
      {followingCount > 0 ? (
        <ul>
          {followingList}
        </ul>
      ) : (
        <p className="text-center my-4">User doesn't followReq any users</p>
      )} 

      {!isLoaded && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}