import { useState, useEffect, useRef } from "react";
import { getProfiles } from "../../service/api";
import Profile from "./Profile";
import Spinner from "../shared/Spinner";

export default function Explore() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [])

  // key state tracking
  console.log(profiles)

  async function search(username) {
    try {
      if (!username) {
        return setProfiles([]);
      }

      setError(null);
      setIsLoaded(false);

      const { profiles } = await getProfiles(username);

      setProfiles(profiles);
      
    } catch (error) {
      setError(error)
    } finally {
      setIsLoaded(true);
    }
  }

  const profileList = profiles.map(profile => (
    <Profile 
      key={profile.id}  
      username={profile.username}
      name={profile.name}
      avatarUrl={profile.avatarUrl}
      isFollowing={profile.isFollowing}
    />
  ))

  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold my-4">Explore</h3>

      {/* Search form */}
      <div className="mb-4">
        <input
          type="text"
          className="border px-2 py-1 rounded w-full outline-none"
          onChange={({ target }) => search(target.value)}
          placeholder="Search"
          ref={inputRef}
        />
      </div>

      {isLoaded ? (
        <ul>
          {profileList}
        </ul>
      ) : (
        <Spinner />
      )}

      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
}

