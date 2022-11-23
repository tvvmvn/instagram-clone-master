import {Link} from "react-router-dom";

export default function Avatar({user}) {
  return (
    <div className="inline-flex items-center">
      <img 
        src={`${process.env.REACT_APP_HOSTNAME}/users/${user.image || "avatar.jpeg"}`} 
        className="w-10 h-10 object-cover rounded-full"
      />      
      <Link 
        to={`/profile/${user.username}`}
        className="ml-2"
      >
        {user.username}
      </Link>
    </div>
  )
}