import { useEffect, useState } from "react";
import SideBar from "./components/SideBar/SideBar";
import Main from "./components/Main/Main";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { updateSwitch, updateTheme } from "./state/theme/themeSlice";
import { updateUser } from "./state/user/userSlice";
import { clearPromptState } from "./state/prompt/promptSlice";
import { useDarkMode } from "usehooks-ts";
import {
  CredentialResponse,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MyJwtPayload extends JwtPayload {
  email: string;
  given_name: string;
  picture: string;
}

function App() {
  const email = useSelector((state: RootState) => state.user.email);
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode } = useDarkMode();
  const [loggedIn, setLoggedIn] = useState(false);

  dispatch(updateTheme(isDarkMode ? "dark" : "light"));
  dispatch(updateSwitch(isDarkMode));

  useEffect(() => {
    if (email) {
      setLoggedIn(true);
    } else {
      dispatch(updateUser({ name: "Dev", email: "", logo: "" }));
      dispatch(clearPromptState());
      setLoggedIn(false);
    }
  }, [email]);

  const handleLoginSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      const decoded = jwtDecode(response.credential) as MyJwtPayload;
      dispatch(
        updateUser({
          name: decoded.given_name,
          email: decoded.email,
          logo: decoded.picture,
        })
      );
      setLoggedIn(true);
      toast.success("Logged in successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
      });
    } else {
      toast.error("Login failed!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  const handleLogout = () => {
    googleLogout();
    dispatch(updateUser({ name: "", email: "", logo: "" }));
    setLoggedIn(false);
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode ? "dark" : "light",
    });
  };

  const logoutButtonStyle = {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  };

  const logoutButtonHoverStyle = {
    ...logoutButtonStyle,
    backgroundColor: "#c82333",
  };

  return (
    <>
      <SideBar />
      <Main />
      <div className="google-login">
        {loggedIn ? (
          <button
            style={logoutButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                logoutButtonHoverStyle.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                logoutButtonStyle.backgroundColor;
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login failed")}
          />
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
