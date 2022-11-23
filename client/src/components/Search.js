import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import Avatar from "./Avatar";
import fetchData from "./fetchData";

export default function Search() {
  const [users, setUsers] = useState([]);
  const inputRef = useRef(null)

  function handleChange(e) {
    const username = e.target.value;

    if (!username.trim()) {
      return setUsers([])
    }

    fetchData(`${process.env.REACT_APP_HOSTNAME}/search/?username=${username}`)
    .then(data => {
      setUsers(data)
    })
    .catch(error => {
      alert("Something's broken");
    })
  }

  useEffect(() => {
    inputRef.current.focus();
  })

  return (
    <div className="px-2">
      <div className="mb-4">
        <input
          type="text"
          className="border px-2 py-1 w-full"
          onChange={handleChange}
          placeholder="Search"
          ref={inputRef}
        />
      </div>

      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <Avatar user={user} />
          </li>
        ))}
      </ul>
    </div>
  )
}
