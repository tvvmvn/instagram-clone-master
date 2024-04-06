import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import PostItem from "./PostItem";
import { getProfile, getTimeline, follow, unfollow } from "../../service/profile";
import Spinner from "../Spinner";

export default function Profile() {

  const { username } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const isMaster = user.username === profile?.username;
  const navigate = useNavigate();

  // key state tracking
  console.log(profile, posts);

  useEffect(() => {
    fetchData();

    document.title = `${username} - Instagram`;
  }, [username]);

  async function fetchData() {
    try {
      setProfile(null);

      const profileData = await getProfile(username);
      const timelineData = await getTimeline(username);

      setProfile(profileData.profile)
      setPosts(timelineData.posts);

    } catch {
      navigate("/notfound", { replace: true });
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

  function handleSignOut() {
    const confirmed = window.confirm("Are you sure to log out?");

    if (confirmed) {
      setUser(null);
    }
  }

  const timeline = posts.map(post => (
    <PostItem
      key={post.id}
      id={post.id}
      thumbnailUrl={post.photoUrls[0]}
      likesCount={post.likesCount}
      commentCount={post.commentCount}
    />
  ))

  if (!profile) {
    return <Spinner />
  }

  return (
    <>
      <div className="px-4 mt-8">
        <div className="flex mb-4">
          {/* Avatar*/}
          <img
            src={profile.avatarUrl}
            className="w-20 h-20 object-cover border rounded-full"
          />

          {/* Profile info */}
          <div className="grow ml-8">
            <div className="flex items-center mb-4">
              <h3>{profile.username}</h3>

              {/* Profile edit & logout button */}
              {isMaster && (
                <div className="flex ml-4">
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

              {/* Follow / Unfollow button */}
              {!isMaster && (
                profile.isFollowing ? (
                  <button
                    className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                    onClick={handleUnfollow}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                    onClick={handleFollow}
                  >
                    Follow
                  </button>
                )
              )}
            </div>

            {/* Count info */}
            <ul className="flex">
              <li className="text-sm">
                {profile.postCount} photos
              </li>
              <li className="ml-4 text-sm">
                <Link to={`/profiles/${username}/followers`}>
                  {profile.followerCount} followers
                </Link>
              </li>
              <li className="ml-4 text-sm">
                <Link to={`/profiles/${username}/following`}>
                  {profile.followingCount} following
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Name and bio, New post button */}
        {profile.name && (
          <h3 className="font-semibold mb-2">
            {profile.name}
          </h3>
        )}

        {profile.bio && (
          <p className="mb-2 whitespace-pre-line text-sm">
            {profile.bio}
          </p>
        )}

        {isMaster && (
          <Link to="/create" className="inline-block text-sm font-semibold text-gray-400">
            Write new post :)
          </Link>
        )}
      </div>

      <div className="border-t mt-4 mb-4"></div>

      {/* Timeline */}
      {timeline.length > 0 ? (
        <ul className="grid grid-cols-3 gap-1">
          {timeline}
        </ul>
      ) : (
        <p className="text-center">{profile.username} has no posts.</p>
      )}
    </>
  )
}


