import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { getProfile, getTimeline, follow, unfollow } from "../service/profile";
import { FaCircleNotch, FaArrowRightFromBracket, FaHeart, FaComment } from "react-icons/fa6";

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
    <li key={post.id}>
      <Link to={`/p/${post.id}`} className="block h-40 relative">
        {/* Image */}
        <img
          src={post.photoUrls[0]}
          className="w-full h-full object-cover"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/[0.2] flex flex-col justify-center opacity-0 hover:opacity-100">
          <div className="flex justify-center">
            <FaHeart className="fill-white" size="20" />
            <span className="ml-2 text-white">{post.likesCount}</span>
          </div>
          <div className="flex justify-center">
            <FaComment className="fill-white" size="20" />
            <span className="ml-2 text-white">{post.commentCount}</span>
          </div>
        </div>
      </Link>
    </li>
  ))

  if (!profile) {
    return (
      <div className="flex justify-center my-4">
        <FaCircleNotch
          size="32"
          className="animate-spin fill-blue-400"
        />
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* Profile Avatar & Info */}
      <div className="flex px-4">
        <img
          src={profile.avatarUrl}
          className="w-20 h-20 object-cover border rounded-full"
        />

        <ul className="ml-2 grow grid grid-cols-3">
          <li className="flex flex-col justify-center items-center">
            <span className="font-semibold">{profile.postCount}</span>
            <span>Posts</span>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link
              to={`/profiles/${username}/followers`}
              className="font-semibold"
            >
              {profile.followerCount}
            </Link>
            <span>Followers</span>
          </li>
          <li className="flex flex-col justify-center items-center">
            <Link
              to={`/profiles/${username}/following`}
              className="font-semibold"
            >
              {profile.followingCount}
            </Link>
            <span>Following</span>
          </li>
        </ul>
      </div>

      {/* Name & bio */}
      <div className="mt-4 px-4">
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
      </div>

      {/* Buttons about accounts */}
      {isMaster && (
        <div className="mt-8 flex px-4">
          <div className="grow grid grid-cols-2 gap-2">
            <Link
              to="/create"
              className="bg-gray-200 rounded-lg px-4 py-2 text-sm text-center font-semibold"
            >
              New post
            </Link>

            <Link
              to="/accounts/edit"
              className="bg-gray-200 rounded-lg px-4 py-2 text-sm text-center font-semibold"
            >
              Edit profile
            </Link>
          </div>

          <button
            className="ml-2 px-4 py-2 text-sm bg-gray-200 font-semibold rounded-lg"
            onClick={handleSignOut}
          >
            <FaArrowRightFromBracket />
          </button>
        </div>
      )}

      {/* Follow & Unfollow button */}
      {!isMaster && (
        <div className="mt-8 grid grid-cols-2 gap-2 px-4">
          {profile.isFollowing ? (
            <button
              className="bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
              onClick={handleUnfollow}
            >
              Following
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
              onClick={handleFollow}
            >
              Follow
            </button>
          )}
          <button className="bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg">
            Message
          </button>
        </div>
      )}

      {/* Timeline */}
      {timeline.length > 0 ? (
        <ul className="mt-8 grid grid-cols-3 gap-1">
          {timeline}
        </ul>
      ) : (
        <p className="mt-8 text-center">{profile.username} has no posts.</p>
      )}
    </div>
  )
}


