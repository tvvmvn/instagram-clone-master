import { useState, useEffect, useRef } from "react";
import { getProfiles } from "../utils/requests";
import { Link } from "react-router-dom";
import Spinner from './Spinner';

export default function Search() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const inputEl = useRef(null);

  console.log(profiles)

  function handleChange(e) {
    const username = e.target.value;

    if (!username) {
      return setProfiles([]);
    }

    setError(null);
    setIsLoaded(false);

    getProfiles(username)
      .then(data => {
        setProfiles(data.profiles);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));
  }

  useEffect(() => {
    inputEl.current.focus();
  })

  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold my-4">Explore</h3>
      <label className="block mb-4">
        <input
          type="text"
          className="border px-2 py-1 rounded w-full"
          onChange={handleChange}
          placeholder="Search"
          ref={inputEl}
        />
      </label>

      <Result 
        error={error} 
        isLoaded={isLoaded} 
        profiles={profiles}
      />
    </div>
  )
}

function Result({ error, isLoaded, profiles }) {
  if (error) {
    return <p className="text-red-500">{error.message}</p>
  }
  
  if (!isLoaded) {
    return <Spinner />
  }

  return profiles.map(profile => (
    <div key={profile.username} className="flex items-center my-2">
      <Link
        to={`/profiles/${profile.username}`}
        className="inline-flex items-center"
      >
        <img
          src={`${process.env.REACT_APP_SERVER}/files/profiles/${profile.avatar}`}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {profile.username}
          </span>
          <span className="block text-gray-400 text-sm">
            {profile.fullName}
          </span>
        </div>

        {/* Follwing Status */}
        {profile.isFollowing && (
          <div className="ml-2 text-sm text-blue-500"> following </div>
        )}
      </Link>
    </div>
  ))
}

