import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import User from './User';
import { fetchFollowers, followReq } from '../utils/requests';
import Spinner from './Spinner';

export default function FollowerList() {

  const {username} = useParams();
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
      .finally(() => setIsLoaded(true))

  }, [])

  async function handleFollow(username, isFollowing) {
    try {
      await followReq(username, isFollowing);

      const updatedFollowers = followers.map(follower => {
        if (follower.username === username) {
          return {...follower, isFollowing: !follower.isFollowing}
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
      className="flex" 
    >
      <User user={follower} />
      <button 
        className={`ml-2 text-blus-500 font-semibold ${!follower.isFollowing && 'text-blue-500'}`}
        onClick={() => handleFollow(follower.username, follower.isFollowing)}
      >
        {follower.isFollowing ? 'Following' : 'Follow'}
      </button>
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