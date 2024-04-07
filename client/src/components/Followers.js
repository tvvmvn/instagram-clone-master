import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFollowers } from "../service/profile";
import Spinner from "./Spinner";

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

  const followerList = profiles.map(profile => (
    <li className="flex justify-between items-center mb-2">
      {/* Profile */}
      <Link
        to={`/profiles/${profile.username}`}
        className="inline-flex items-center"
      >
        <img
          src={profile.avatarUrl}
          className="w-12 h-12 object-cover rounded-full border"
        />
        <div className="ml-2">
          <h3 className="block font-semibold">
            {profile.username}
          </h3>
          <span className="block text-gray-400 text-sm">
            {profile.name}
          </span>
        </div>
      </Link>
    </li>
  ))  

  return (
    <div className="px-2">
      <h3 className="text-lg my-4 font-semibold">{username}'s followers</h3>
      
      {followerList.length > 0 ? (
        <ul>
          {followerList}
        </ul>
      ) : (
        <p>no followers.</p>
      )}

      {!isLoaded && <Spinner />}

      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
}

