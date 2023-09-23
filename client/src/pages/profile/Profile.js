import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthContext from "../../auth/AuthContext";
import ProfileInfo from "./ProfileInfo";
import Thumbnail from "./Thumbnail";
import PostCreate from "../PostCreate";
import { getProfile, getTimeline, follow, unfollow } from "../../service/api";
import Spinner from "../shared/Spinner";

export default function Profile() {

  const { username } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // key state
  console.log(profile)
  console.log(posts)

  useEffect(() => {
    fetchData()
  }, [username]);

  async function fetchData() {
    try {
      setProfile(null)

      const profileData = await getProfile(username);
      const timelineData = await getTimeline(username);
      
      setProfile(profileData.profile)
      setPosts(timelineData.posts);

    } catch {
      navigate('/notfound', { replace: true });
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
    const confirmed = window.confirm('Are you sure to log out?');

    if (confirmed) {
      setUser(null);
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
        postCount={profile.postCount}
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
      {postList.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 mb-2">
          {postList}
        </ul>
      ) : (
        <p className="text-center">{profile.username} has no posts.</p>
      )}

      {/* Modal for post*/}
      <PostCreate />
    </>
  )
}


