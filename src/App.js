import './App.css';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignUp from './Component/SignUp/SignUp';
import Login from './Component/Login/Login';
import Blog from './Component/Blog/Blog';
import UploadBlog from './Component/Blog/UploadBlog';
import BlogPage from './Component/Shared/BlogPage';
import { useAuth } from './Component/Context/AuthContext';
import MyBlogs from './Component/MyBlog/MyBlogs';
import PublicBlog from './Component/Shared/PublicBlogs';
import ApprovedBlog from './Component/Shared/ApprovedBlogs';
import PendingRejectedBlogs from './Component/Shared/PendingRejectedBlog';
import PrivateBlogs from './Component/Shared/PrivateBlogs';

function App() {

  const { loggedIn } = useAuth();

  
  return (
    <div className="App">
      <Router>
        <Routes>

        <Route path="/Blog" element={<Blog />} />
        <Route path="/blog/:blogId" element={<BlogPage   />} />


          {loggedIn ? (
            <>
            <Route path="/blog/upload" element={<UploadBlog  />} />
            <Route path="/my_blogs" element={<MyBlogs />} />
            <Route path="/public_blogs" element={<PublicBlog />} />
            <Route path="/approved_blogs" element={<ApprovedBlog />} />
            <Route path="/pending_rejected_blogs" element={<PendingRejectedBlogs />} />
            <Route path="/private_blogs" element={<PrivateBlogs />} />

            </>
          ) : (
            <>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login  />} />
            
            <Route path="/*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </Router>
      
    </div>
  );
}


function NotFound() {
  return <h1>Page not found. <Link className="text-red-600">Go to Homepage</Link></h1>;
}

export default App;
