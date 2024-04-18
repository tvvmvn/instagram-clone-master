import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getProfiles } from "../service/profile";
import { FaCircleNotch } from "react-icons/fa6";

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
    <li className="flex items-center justify-between my-2">
      <Link
        to={`/profiles/${profile.username}`}
        className="flex items-center"
      >
        <img
          src={profile.avatarUrl}
          className="w-10 h-10 object-cover rounded-full"
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

      {profile.isFollowing && (
        <div className="ml-2 text-sm text-blue-500 font-semibold">
          following
        </div>
      )}
    </li>
  ))

  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold my-4">Explore</h3>

      {/* Search Input */}
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

