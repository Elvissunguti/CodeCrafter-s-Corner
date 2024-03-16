import './App.css';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignUp from './Component/SignUp/SignUp';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import NavBar from './Component/Home/NavBar';
import Login from './Component/Login/Login';
import Blog from './Component/Blog/Blog';
import UploadBlog from './Component/Blog/UploadBlog';
import BlogPage from './Component/Shared/BlogPage';
import { makeAuthenticatedGETRequest } from './Component/Utils/Helpers';

function App() {

  const [ loggedIn, setLoggedIn ] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Check if the token exists in cookies to determine if the user is logged in
    const token = Cookies.get('token');
    setLoggedIn(!!token);
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await makeAuthenticatedGETRequest("/auth/userId");
      setCurrentUserId(response.data);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };


  const handleLogin = () => {
    setLoggedIn(true);
    fetchUserId();
  };


  return (
    <div className="App">
      <Router>
        <Routes>

        <Route path="/Blog" element={<Blog />} />
        <Route path="blog/:blogId" element={<BlogPage  loggedIn={loggedIn} currentUserId={currentUserId} />} />

          {loggedIn ? (
            <>
            <Route path="/blog/upload" element={<UploadBlog  />} />

            </>
          ) : (
            <>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/navbar" element={<NavBar />} />
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
