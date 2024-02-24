import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFollowers, follow, unfollow } from "../../service/profile";
import ProfileItem from "./ProfileItem";
import Spinner from "../Spinner";

export default function Followers() {

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
      const data = await getFollowers(username);
      
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

  const followerList = profiles.map(profile => (
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

