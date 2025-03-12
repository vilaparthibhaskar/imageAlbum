import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from '../store/slice/userSlice';
import { motion } from "framer-motion";

export function Header() {
  const dispatch = useDispatch();
  const loggedin = useSelector((state) => state.user.loggedin);
  const name = useSelector((state) => state.user.name);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "linear-gradient(90deg, #ffc8dd, #ffafcc)",
        padding: "0.2rem",
        minHeight: "1.5rem", 
        opacity: '85%'
      }}
    >
      <div className="container-fluid">
        <h2 className="navbar-brand text-white fw-bold fs-4" href="#">
          Welcome {name}
        </h2>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item mx-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={loggedin ? handleLogOut : handleLogin}
                className="btn px-3 fw-bold"
                style={{
                  backgroundColor: loggedin ? '#ae2012' : '#3a5a40',
                  color: 'white'
                }}
              >
                {loggedin ? 'Log Out' : 'Log In'}
              </motion.button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
