import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import SignUp from "./auth/SignUp";
import SignIn from "./auth/SignIn";
import Profile from "./auth/Profile";
import PostToot from "./pages/PostToot";
import ForgotPassword from "./auth/ForgotPassword";
import ProtectedRoute from "./components/Protectedroutes";
import About from "./pages/AboutUs";
import { UserHistory } from "./pages/UserActivities";
import { PostedToots } from "./pages/PostedToots";
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post-toot" element={<PostToot />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* protected routes need to be added here */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
              <Route
            path="/history"
            element={
              <ProtectedRoute>
                <UserHistory />
              </ProtectedRoute>
            }
          />
            <Route
            path="/postedtoots"
            element={
              <ProtectedRoute>
                <PostedToots />
              </ProtectedRoute>
            }
          />

          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
