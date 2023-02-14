import {Link} from "react-router-dom";

export default function Avatar({user}) {
  return (
    <Link
      to={`/profile/${user.username}`}
      className="inline-flex items-center"
    >
      <img
        src={user.image ? `${process.env.REACT_APP_SERVER}/files/profiles/${user.image}` : '/images/default.png'}
        className="w-10 h-10 object-cover rounded-full"
      />
      <span className="ml-2">
        {user.username}
      </span>
    </Link>
  )
}