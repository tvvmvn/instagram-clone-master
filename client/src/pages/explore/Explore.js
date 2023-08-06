import { useState } from "react";
import { getProfiles } from "../../service/api";
import Form from "./Form";
import Profile from "./Profile";
import Spinner from '../common/Spinner';

export default function Search() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [profiles, setProfiles] = useState([]);

  // tracking
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

      setIsLoaded(true);

    } catch (error) {
      setError(error)
    }
  }

  const profileList = profiles.map(profile => (
    <Profile 
      key={profile.id}
      id={profile.id}
      username={profile.username}
      name={profile.name}
      avatarUrl={profile.avatarUrl}
      isFollowing={profile.isFollowing}
    />
  ))

  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold my-4">Explore</h3>
      {/* Search input */}
      <Form search={search} />
      
      {/* profile list */}
      <ul>
        {profileList}
      </ul>

      {!isLoaded && <Spinner />}
      
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}

