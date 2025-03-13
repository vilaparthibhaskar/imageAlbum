import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {change_albums, change_name, change_loggedin, change_email, update_token, update_userid } from '../store/slice/userSlice'
const apiUrl = import.meta.env.VITE_API_URL;
import { Link } from 'react-router-dom';


export function LoginPage() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target); // event.target is now the form
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        dispatch(change_name(data.user.name))
        dispatch(change_loggedin(true))
        dispatch(update_token(data.token))
        dispatch(change_email(data.user.email))
        dispatch(update_userid(data.user._id))
        dispatch(change_albums(data.albums))
        localStorage.setItem('token', data.token)
        navigate('/albums')
    } else {
        alert('Login failed.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "24rem" }}>
        <div className="card-header text-center">
          <h2 className="fw-bold">Login</h2>
        </div>
        <div className="card-body">
          {/* ✅ Wrap in a form and use onSubmit */}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                name="email"  // ✅ Ensure name attribute is present
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                name="password" // ✅ Ensure name attribute is present
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <p className="text-center text-muted mt-3">
            Don't have an account? <Link to="/signup" className="text-primary">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
