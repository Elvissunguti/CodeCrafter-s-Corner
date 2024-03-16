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

function App() {

  const [ loggedIn, setLoggedIn ] = useState(false);

  useEffect(() => {
    // Check if the token exists in cookies to determine if the user is logged in
    const token = Cookies.get('token');
    setLoggedIn(!!token);
  }, []);


  return (
    <div className="App">
      <Router>
        <Routes>

        <Route path="/Blog" element={<Blog />} />
        <Route path="blog/:blogId" element={<BlogPage  loggedIn={loggedIn} />} />

          {loggedIn ? (
            <>
            <Route path="/blog/upload" element={<UploadBlog  />} />

            </>
          ) : (
            <>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
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
