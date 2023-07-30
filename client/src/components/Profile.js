import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import ArticleCreate from "./ArticleCreate";
import Timeline from "./Timeline";
import { getProfile, getTimeline, follow, unfollow } from "../utils/requests";
import Spinner from "./Spinner";

export default function Profile() {

  const { username } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const isMaster = user.username === username;
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState(null);
  const [articleCount, setArticleCount] = useState(0);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  console.log(profile)

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
        navigate('/notfound', { replace: true });
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

      setProfile({ ...profile, isFollowing: false });

    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    document.title = `${username} - Instagram`
  }, [])

  if (!profile) {
    return <Spinner />
  }

  return (
    <>
      <div className="px-4 mt-8">
        {/* Profile Image and Info */}
        <div className="flex mb-4">
          <img
            src={`${process.env.REACT_APP_SERVER}/files/avatar/${profile.avatar}`}
            className="w-20 h-20 object-cover border rounded-full"
          />

          <div className="grow ml-4">
            <div className="flex items-center mb-4">
              <h3>{profile.username}</h3>

              {isMaster && (
                <div className="flex ml-2">
                  <Link to="/accounts/edit" className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-semibold">
                    Edit profile
                  </Link>

                  <button
                    className="ml-2 bg-gray-200 px-4 py-2 text-sm font-semibold rounded-lg"
                    onClick={handleSignOut}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4"
                    >
                      <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                    </svg>
                  </button>
                </div>
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

            <ul className="flex items-center">
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

            <svg 
              className="opacity-40 w-12 fixed right-8 bottom-8 hover:opacity-80 cursor-pointer z-10"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512"
              onClick={() => setActive(true)}
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
            </svg>
          </div>
        </div>

        {/* Name and Bio */}
        {profile.fullName && (
          <h3 className="text-sm font-semibold my-2">{profile.fullName}</h3>
        )}
        {profile.bio && (
          <p className="text-sm my-2 whitespace-pre-line">
            {profile.bio}
          </p>
        )}
      </div>

      <div className="border-t my-4"></div>

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