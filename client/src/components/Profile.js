import {useState, useEffect, useContext} from "react";
import {useParams, Link} from "react-router-dom";
import AuthContext from "./AuthContext";
import fetchData from "./fetchData";

export default function Profile() {
  const {username} = useParams();

  return (
    <>
      <Details username={username} />
      <Timeline username={username} />
    </>  
  )
}
function Details({username}) {
  const [profile, setProfile] = useState(null);
  const auth = useContext(AuthContext);
  const isMaster = auth.user.username === username;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);

    fetchData(`${process.env.REACT_APP_HOSTNAME}/profiles/${username}`)
    .then(data => {
      setProfile(data);
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [username])

  function follow() {
    fetch(`${process.env.REACT_APP_HOSTNAME}/profiles/${profile.username}/follow`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedProfile = {...profile, isFollowing: true}
      setProfile(editedProfile);
    })
    .catch(error => {
      alert("Something's broken")
    })
  } 

  function unfollow() {
    fetch(`${process.env.REACT_APP_HOSTNAME}/profiles/${profile.username}/follow`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedProfile = {...profile, isFollowing: false}
      setProfile(editedProfile);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  if (error) {
    return <p>failed to fetch profile</p>
  }
  if (!isLoaded) {
    return <p>fetching profile...</p>
  }

  return (
    <>
      <div className="mb-4 px-2">
        <div className="flex items-center flex-col">
          <img 
            src={`${process.env.REACT_APP_HOSTNAME}/users/${profile.image || "avatar.jpeg"}`} 
            className="w-36 h-36 object-cover rounded-full"
          />
          <h3 className="font-bold">{profile.username}</h3>
          <p className="">{profile.bio}</p>
          {isMaster && <Link to="/accounts/edit" className="text-xs text-gray-400">Edit profile</Link>}
        </div>

        {!isMaster && (
          profile.isFollowing ? (
            <button className="mt-2 border border-black p-1 w-full" onClick={unfollow}>
              Following
            </button>
          ) : (
            <button className="mt-2 border border-blue-500 text-blue-500 p-1 w-full" onClick={follow}>
              Follow
            </button>
          )
        )}
      </div>

      <div className="mb-4">
        <ul className="flex border-y">
          <li className="flex flex-col items-center w-1/3">
            <div>Follower</div>
            <div>{profile.followersCount}</div>
          </li>
          <li className="flex flex-col items-center w-1/3">
            <div>
              Following
            </div>
            <div>
              {profile.followingCount}
            </div>
          </li>
          <li className="flex flex-col items-center w-1/3">
            <div>
              Articles
            </div>
            <div>
              {profile.articlesCount}
            </div>
          </li>
        </ul>
      </div>
    </>  
  )
}

function Timeline({username}) {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);

    fetchData(`${process.env.REACT_APP_HOSTNAME}/profiles/${username}/articles`)
    .then(data => {
      setArticles(data)
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [username])

  const articleList = articles.map(article => (
    <li key={article._id} className="h-40">
      <Link key={article._id} to={`/article/${article._id}`}>
        <img
          src={`${process.env.REACT_APP_HOSTNAME}/articles/${article.photos[0]}`}
          className="w-full h-full object-cover"
        />
      </Link>
    </li>
  ))

  return (
    <>
      <ul className="grid grid-cols-3 gap-1 mb-2">
        {articleList}
      </ul>

      {!isLoaded && <p>fetching timeline...</p>}
      {error && <p>failed to fetch timeline</p>}
    </>  
  )
}