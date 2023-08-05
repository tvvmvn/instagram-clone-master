import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import PostCreate from "./PostCreate";
import { getProfile, getTimeline, follow, unfollow } from "../utils/requests";
import Spinner from "./Spinner";

export default function Profile() {

  const { username } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  console.log(profile)
  console.log(posts)

  useEffect(() => {
    setProfile(null);

    Promise.all([
      getProfile(username),
      getTimeline(username)
    ])
      .then(([profileData, timelineData]) => {
        setProfile(profileData.profile);

        setPosts(timelineData.posts);
        setPostCount(timelineData.postCount)
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

  const postList = posts.map(post => (
    <Post 
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
      <ProfileDetail
        name={profile.name}
        bio={profile.bio}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        isFollowing={profile.isFollowing}
        handleSignOut={handleSignOut}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        postCount={postCount}
        isMaster={user.username === username}
        followerCount={profile.followerCount}
        followingCount={profile.followingCount}
      />

      <div className="border-t my-4"></div>

      {/* Timeline */}
      {postCount > 0 ? (
        <ul className="grid grid-cols-3 gap-2 mb-2">
          {postList}
        </ul>
      ) : (
        <p className="text-center">This user has no posts.</p>
      )}

      {/* Modal open button */}
      <svg
        className="opacity-40 w-12 fixed right-8 bottom-8 hover:opacity-80 cursor-pointer z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        onClick={() => setModalOpen(true)}
      >
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
      </svg>

      {/* Modal for post*/}
      {modalOpen && (
        <PostCreate 
          setModalOpen={setModalOpen} 
        />
      )}
    </>
  )
}

function ProfileDetail({
  username,
  name, 
  bio,
  avatarUrl,
  handleSignOut,
  handleFollow,
  handleUnfollow,
  isMaster,
  isFollowing,
  postCount,
  followerCount,
  followingCount
}) {

  const signOutButton = (
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
  )

  const followButton = (
    <button
      className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
      onClick={handleFollow}
    >
      Follow
    </button>
  )

  const unfollowButton = (
    <button
      className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
      onClick={handleUnfollow}
    >
      Following
    </button>
  )

  return (
    <div className="px-4 mt-8">
      <div className="flex mb-4">
        {/* Avatar image */}
        <img
          src={avatarUrl}
          className="w-20 h-20 object-cover border rounded-full"
        />

        <div className="grow ml-4">
          <div className="flex items-center mb-4">
            <h3>{username}</h3>

            {/* Edit and sign out button */}
            {isMaster && (
              <div className="flex ml-2">
                <Link to="/accounts/edit" className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-semibold">
                  Edit profile
                </Link>

                {signOutButton}
              </div>
            )}

            {/* Follow/Unfollow button */}
            {(!isMaster && !isFollowing) && followButton}
            {(!isMaster && isFollowing) && unfollowButton}
          </div>

          <ul className="flex items-center">
            {/* Post count */}
            <li className="w-1/3">
              <div className="text-sm">
                <span className="font-semibold">
                  {postCount}
                </span>
                {" "}
                photos
              </div>
            </li>

            {/* Follower count */}
            <li className="w-1/3">
              <Link to={`/profiles/${username}/followers`} className="block text-sm">
                <span className="font-semibold">
                  {followerCount}
                </span>
                {" "}
                followers
              </Link>
            </li>

            {/* Following count */}
            <li className="w-1/3">
              <Link to={`/profiles/${username}/following`} className="block text-sm">
                <span className="font-semibold">
                  {followingCount}
                </span>
                {" "}
                following
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Name */}
      {name && (
        <h3 className="text-sm font-semibold my-2">
          {name}
        </h3>
      )}

      {/* Bio */}
      {bio && (
        <p className="text-sm my-2 whitespace-pre-line">
          {bio}
        </p>
      )}
    </div>
  )
}

function Post({ id, thumbnailUrl, likesCount, commentCount }) {
  return (
    <li>
      <Link to={`/p/${id}`} className="block h-40 relative">
        {/* Thumbnail Image */}
        <img
          src={thumbnailUrl}
          className="w-full h-full object-cover"
        />

        {/* Likes and comment count */}
        <div className="absolute inset-0 bg-black/[0.2] opacity-0 hover:opacity-100">
          <div className="flex flex-col justify-center h-full">
            {/* Likes count */}
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-5 fill-white"
              >
                <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" />
              </svg>
              <span className="ml-2 text-white">{likesCount}</span>
            </div>

            {/* Comment count */}
            <div className="flex justify-center">
              <svg
                className="w-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 32C114.6 32 .0272 125.1 .0272 240c0 49.63 21.35 94.98 56.97 130.7c-12.5 50.37-54.27 95.27-54.77 95.77c-2.25 2.25-2.875 5.734-1.5 8.734C1.979 478.2 4.75 480 8 480c66.25 0 115.1-31.76 140.6-51.39C181.2 440.9 217.6 448 256 448c141.4 0 255.1-93.13 255.1-208S397.4 32 256 32z" />
              </svg>
              <span className="ml-2 text-white">{commentCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
