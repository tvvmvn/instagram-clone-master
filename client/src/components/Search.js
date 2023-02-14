import { useState, useEffect, useRef } from "react";
import User from './User';
import { searchUserByUsername } from "../utils/requests";
import Spinner from './Spinner';

export default function Search() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [users, setUsers] = useState([]);
  const inputEl = useRef(null);

  function handleChange(e) {
    const username = e.target.value;

    if (!username) {
      return setUsers([]);
    }

    setError(null);
    setIsLoaded(false);

    searchUserByUsername(username)
      .then(data => {
        setUsers(data.users);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));
  }

  useEffect(() => {
    inputEl.current.focus();
  })

  useEffect(() => {
    document.title = `Instagram`
  }, [])

  return (
    <div className="px-4">
      <label className="block mt-8 mb-4">
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
        users={users} 
      />
    </div>
  )
}

function Result({ error, isLoaded, users }) {
  if (error) {
    return <p className="text-red-500">{error.message}</p>
  }
  
  if (!isLoaded) {
    return <Spinner />
  }

  return users.map(user => (
    <div key={user.username} className="flex items-center my-2">
      <User user={user}/>
      {user.isFollowing && <span className="ml-2 text-blue-500 text-sm">Following</span>}
    </div>
  ))
}

