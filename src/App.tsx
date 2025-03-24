import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import SignUp from "./auth/SignUp";
import SignIn from "./auth/SignIn";
import Profile from "./auth/Profile";
import PostToot from "./pages/PostToot";
import ForgotPassword from "./auth/ForgotPassword";
import ProtectedRoute from "./components/Protectedroutes";
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post-toot" element={<PostToot />} />
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
