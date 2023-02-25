import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import ArticleCreate from "./ArticleCreate";
import Timeline from "./Timeline";
import { getProfile, getTimeline, follow, unfollow } from "../utils/requests";

export default function Profile() {
  const { username } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const isMaster = user.username === username;
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState(null);
  const [articleCount, setArticleCount] = useState(0);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setProfile(null);

    Promise.all([
      getProfile(username),
      getTimeline(username)
    ])
      .then(([profileData, timelineData]) => {
        setProfile(profileData.profile);
        
        setArticles(timelineData.articles);
        setArticleCount(timelineData.articleCount)
      })
      .catch(error => {
        navigate('/notfound', { replace: true })
      })

  }, [username]);

  function handleSignOut() {
    const confirmed = window.confirm('Are you sure to log out?');

    if (confirmed) {
      setUser(null);
    }
  }

  async function handleFollow() {
    try {
      await follow(username)

      setProfile({ ...profile, isFollowing: true })

    } catch (error) {
      alert(error)
    }
  }

  async function handleUnfollow() {
    try {
      await unfollow(username)

      setProfile({ ...profile, isFollowing: false })

    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    document.title = `${username} - Instagram`
  }, [])

  if (!profile) {
    return <p>fetching profile...</p>
  }

  return (
    <>
      <div className="px-4 mt-8">
        <div className="flex">
          <img
            src={`${process.env.REACT_APP_SERVER}/files/profiles/${profile.image}`}
            className="w-20 h-20 object-cover border rounded-full"
          />

          <div className="grow ml-4">
            <div className="flex items-center mb-4">
              <h3>{profile.username}</h3>

              {isMaster && (
                <>
                  <Link to="/accounts/edit" className="ml-2 bg-gray-200 rounded-lg px-4 py-2 text-sm font-semibold">
                    Edit profile
                  </Link>

                  <button
                    className="ml-2 bg-gray-200 px-4 py-2 text-sm font-semibold rounded-lg"
                    onClick={handleSignOut}
                  >
                    Out
                  </button>
                </>
              )}
              {(!isMaster && profile.isFollowing) && (
                <button
                  className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                  onClick={handleUnfollow}
                >
                  Following
                </button>
              )}
              {(!isMaster && !profile.isFollowing) && (
                <button
                  className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>

            <ul className="flex items-center mb-4">
              <li className="w-1/3">
                <div className="text-sm">
                  <span className="font-semibold">
                    {profile.articleCount}
                  </span>
                  {" "}
                  photos
                </div>
              </li>
              <li className="w-1/3">
                <Link to={`/profiles/${username}/followers`} className="block text-sm">
                  <span className="font-semibold">
                    {profile.followerCount}
                  </span>
                  {" "}
                  followers
                </Link>
              </li>
              <li className="w-1/3">
                <Link to={`/profiles/${username}/following`} className="block text-sm">
                  <span className="font-semibold">
                    {profile.followingCount}
                  </span>
                  {" "}
                  following
                </Link>
              </li>
            </ul>

            <div>
              {profile.fullName && (
                <h3 className="text-sm font-semibold my-2">{profile.fullName}</h3>
              )}
              <p className="text-sm my-2">
                {profile.bio}
              </p>
            </div>
            
            <button
              className="fixed right-8 bottom-8 hover:scale-110"
              onClick={() => setActive(true)}
            >
              <svg 
                className="w-6"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
              >
                <path d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z"/>
              </svg>
            </button>

          </div>
        </div>
      </div>

      <hr className="mt-4 mb-8" />

      <Timeline
        articles={articles}
        articleCount={articleCount}
      />

      <ArticleCreate
        active={active}
        setActive={setActive}
      />
    </>
  )
}