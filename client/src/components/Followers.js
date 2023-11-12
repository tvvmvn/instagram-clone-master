import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFollowers, follow, unfollow } from "../service/profile";
import Avatar from "./Avatar";
import Spinner from "./Spinner";

export default function Followers() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followers, setFollowers] = useState([]);

  // key state tracking
  console.log(followers);

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const data = await getFollowers(username)
      
      setFollowers([...followers, ...data.profiles]);

    } catch (error) {
      setError(error)
    } finally {
      setIsLoaded(true)
    }
  }

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
    <Avatar 
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
      
      {followerList.length > 0 ? (
        <ul>
          {followerList}
        </ul>
      ) : (
        <p>0 followers</p>
      )}

      {!isLoaded && <Spinner />}
      
      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
}

