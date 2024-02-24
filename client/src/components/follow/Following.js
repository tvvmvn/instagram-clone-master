import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFollowingUsers, follow, unfollow } from "../../service/profile";
import ProfileItem from "./ProfileItem";
import Spinner from "../Spinner";

export default function Following() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [profiles, setProfiles] = useState([]);

  // key state tracking
  console.log(profiles)

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    try {
      const data = await getFollowingUsers(username);
      
      setProfiles(data.profiles);

    } catch (error) {
      setError(error);
    } finally {
      setIsLoaded(true) 
    }
  }

  async function handleFollow(username) {
    try {
      await follow(username)

      const updatedProfiles = profiles.map(profile => {
        if (profile.username === username) {
          return { ...profile, isFollowing: true }
        }

        return profile;
      })

      setProfiles(updatedProfiles);

    } catch (error) {
      alert(error)
    }
  }

  async function handleUnfollow(username) {
    try {
      await unfollow(username)

      const updatedProfiles = profiles.map(profile => {
        if (profile.username === username) {
          return { ...profile, isFollowing: false }
        }

        return profile;
      })

      setProfiles(updatedProfiles);

    } catch (error) {
      alert(error)
    }
  }

  const followingList = profiles.map(profile => (
    <ProfileItem 
      key={profile.id}
      username={profile.username}
      name={profile.name}
      avatarUrl={profile.avatarUrl}
      isFollowing={profile.isFollowing}
      handleFollow={handleFollow}
      handleUnfollow={handleUnfollow}
    />
  ))  

  return (
    <div className="px-2">
      <h3 className="text-lg my-4 font-semibold">{username}'s following</h3>
      
      {followingList.length > 0 ? (
        <ul>
          {followingList}
        </ul>
      ) : (
        <p>0 following</p>
      )}

      {!isLoaded && <Spinner />}

      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
}

