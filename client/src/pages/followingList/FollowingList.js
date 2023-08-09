import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowingUsers, follow, unfollow } from '../../service/api';
import FollowingUser from './FollowingUser';
import Spinner from '../shared/Spinner';

export default function FollowingList() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);

  // key state
  console.log(followingUsers)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const data = await getFollowingUsers(username);
      
      setFollowingCount(data.profileCount);
      setFollowingUsers([...followingUsers, ...data.profiles]);

    } catch (error) {
      setError(error);
    } finally {
      setIsLoaded(true) 
    }
  }

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
      avatarUrl={followingUser.avatarUrl}
      isFollowing={followingUser.isFollowing}
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

