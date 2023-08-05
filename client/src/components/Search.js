import { useState, useEffect, useRef } from "react";
import { getProfiles } from "../utils/requests";
import { Link } from "react-router-dom";
import Spinner from './Spinner';

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

function Form({ search }) {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  })

  return (
    <label className="block mb-4">
      <input
        type="text"
        className="border px-2 py-1 rounded w-full"
        onChange={({ target }) => search(target.value)}
        placeholder="Search"
        ref={inputEl}
      />
    </label>
  )
}

function Profile({ id, username, name, avatarUrl, isFollowing }) {
  return (
    <li className="flex items-center justify-between my-2">
      <Link
        to={`/profiles/${username}`}
        className="flex items-center"
      >
        <img
          src={avatarUrl}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {username}
          </span>
          <span className="block text-gray-400 text-sm">
            {name}
          </span>
        </div>
      </Link>

      {/* Follwing Status */}
      {isFollowing && (
        <div className="ml-2 text-sm text-blue-500 font-semibold">following</div>
      )}
    </li>
  )
}