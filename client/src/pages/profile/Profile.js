import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthContext from "../../auth/AuthContext";
import ProfileInfo from "./ProfileInfo";
import Thumbnail from "./Thumbnail";
import PostCreate from "../PostCreate";
import { getProfile, getTimeline, follow, unfollow } from "../../service/api";
import Spinner from "../common/Spinner";

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
    <Thumbnail 
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
      <ProfileInfo
        username={profile.username}
        name={profile.name}
        avatarUrl={profile.avatarUrl}
        bio={profile.bio}
        postCount={postCount}
        followerCount={profile.followerCount}
        followingCount={profile.followingCount}
        isFollowing={profile.isFollowing}
        handleSignOut={handleSignOut}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        isMaster={user.username === username}
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

