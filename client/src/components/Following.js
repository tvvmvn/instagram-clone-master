import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFollowingUsers } from "../service/profile";
import { FaCircleNotch } from "react-icons/fa6";


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

  const followingList = profiles.map(profile => (
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
      <h3 className="text-lg my-4 font-semibold">{username}'s following</h3>
      
      {followingList.length > 0 ? (
        <ul>
          {followingList}
        </ul>
      ) : (
        <p>no following profiles.</p>
      )}

      {!isLoaded && (
        <div className="flex justify-center my-4">
          <FaCircleNotch
            size="32"
            className="animate-spin fill-blue-400"
          />
        </div>
      )}

      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
}

