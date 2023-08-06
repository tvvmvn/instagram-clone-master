import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from './auth/AuthProvider';
import AuthRequired from "./auth/AuthRequired";
import Layout from "./pages/Layout";
import Feed from "./pages/Feed";
import PostView from "./pages/PostView";
import Comments from "./pages/comments/Comments";
import Explore from "./pages/explore/Explore";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/profile/Profile";
import FollowerList from "./pages/followerList/FollowerList";
import FollowingList from "./pages/followingList/FollowingList";
import ProfileEdit from "./pages/ProfileEdit";
import NotFound from "./pages/NotFound";

export default function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <AuthRequired>
              <Layout />
            </AuthRequired>
          }>
            <Route index element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="p/:id">
              <Route index element={<PostView />} />
              <Route path="comments" element={<Comments />} />
            </Route>
            <Route path="profiles/:username">
              <Route index element={<Profile />} />
              <Route path="followers" element={<FollowerList />} />
              <Route path="following" element={<FollowingList />} />
            </Route>
            <Route path="accounts/edit" element={<ProfileEdit />} />
          </Route>
          <Route path="accounts/login" element={<Login />} />
          <Route path="accounts/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
