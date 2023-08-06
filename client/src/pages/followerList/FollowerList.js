import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowers, follow, unfollow } from '../../service/api';
import Follower from './Follower';
import Spinner from '../common/Spinner';

export default function FollowerList() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);

  console.log(followers)

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

  async function handleFollow(username) {
    try {
      await follow(username)

      const updatedFollowers = followers.map(follower => {
        if (follower.username === username) {
          return { ...follower, isFollowing: true }
        }

        return follower;
      })

      setFollowers(updatedFollowers);

    } catch (error) {
      alert(error)
    }
  }

  async function handleUnfollow(username) {
    try {
      await unfollow(username)

      const updatedFollowers = followers.map(follower => {
        if (follower.username === username) {
          return { ...follower, isFollowing: false }
        }

        return follower;
      })

      setFollowers(updatedFollowers);

    } catch (error) {
      alert(error)
    }
  }

  const followerList = followers.map(follower => (
    <Follower 
      key={follower.id}
      username={follower.username}
      name={follower.name}
      avatarUrl={follower.avatarUrl}
      isFollowing={follower.isFollowing}
      handleFollow={handleFollow}
      handleUnfollow={handleUnfollow}
    />
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
