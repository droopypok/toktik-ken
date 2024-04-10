import { React, useContext, useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";

const Navbar = () => {
  const userCtx = useContext(UserContext);
  const searchUserRef = useRef();
  const fetchProfile = useFetch();
  const [adminView, setAdminView] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);

  useEffect(() => {}, [adminView]);
  useEffect(() => {
    getAllUsers();
  }, []);

  const handleLogout = () => {
    localStorage.clear("refresh");
    userCtx.setRole("");
    userCtx.setAccessToken("");
    userCtx.setProfilePic("");
  };

  const getAllUsers = async () => {
    try {
      const response = await fetchProfile(
        "/users/",
        "GET",
        undefined,
        undefined
      );

      if (response.ok) {
        const filteredUsers = response.data.filter(
          (user) => user.role === "user"
        );

        setAllUsers(filteredUsers);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error.message);
      }
    }
  };

  const handleSearchUser = () => {
    if (searchUserRef.current.value.length > 0) {
      const tempArray = [...allUsers];
      const filterSearch = tempArray.filter((user) =>
        user.username.includes(searchUserRef.current.value)
      );

      setDisplayedUsers(filterSearch);
    } else {
      setDisplayedUsers([]);
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={`row ${styles.container}`}>
        <div className={`col ${styles.logo}`}>
          <Link to="/main">
            <img src="https://fontmeme.com/permalink/240402/d3d95be2d8e76c275d690618dd82def0.png" />
          </Link>
        </div>
        {userCtx.role === "user" ? (
          <div className={`col ${styles.navigation}`}>
            <div className={styles.dropdown}>
              <button className={styles.navlinks}>
                <img
                  className={styles.userProfilePic}
                  src={userCtx.profilePic}
                />
              </button>

              <div className={styles.dropdownlinks}>
                <Link to={`/profile/${userCtx.username}`}> Profile </Link>
                <Link
                  to="/login"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </Link>
              </div>
            </div>

            <button className={styles.navlinks}>
              <Link to="/dm">
                <span
                  className={`material-symbols-outlined ${styles.userIcon} active`}
                >
                  mail
                </span>
              </Link>
            </button>

            <button className={styles.navlinks}>
              <NavLink to="/upload">
                <span
                  id="icon"
                  className={`material-symbols-outlined ${styles.userIcon}`}
                >
                  add
                </span>
              </NavLink>
            </button>

            <div className={styles.dropdown}>
              <div className={styles.navlinks}>
                <input
                  placeholder="Search for Toktikers..."
                  ref={searchUserRef}
                  type="text"
                  onKeyUp={() => {
                    handleSearchUser();
                  }}
                  onBlur={() => {
                    {
                      searchUserRef.current.value = "";
                      handleSearchUser();
                      // setDisplayedUsers([]);
                    }
                  }}
                ></input>
              </div>

              {displayedUsers.length > 0 && (
                <div className={styles.dropdownuser}>
                  {displayedUsers.map((user) => {
                    return (
                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => {
                          searchUserRef.current.value = "";
                          setDisplayedUsers([]);
                        }}
                      >
                        <img
                          src={user.profilePicture}
                          alt=""
                          className={styles.profilePic}
                        />
                        <div className={styles.username}>{user.username}</div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        {userCtx.accessToken.length === 0 ? (
          <div className={`col ${styles.navigation}`}>
            <button className={styles.guestProfilePic}>
              <Link to="/register">
                <span
                  className={`material-symbols-outlined ${styles.guestProfilePic}`}
                >
                  account_circle
                </span>
              </Link>
            </button>
            <button className={styles.navlinks}>
              <Link style={{ fontSize: 18, marginRight: 15 }} to="/login">
                Login / Signup
              </Link>
            </button>
          </div>
        ) : (
          ""
        )}

        {userCtx.role === "admin" && !adminView ? (
          <div className={`col ${styles.navigation}`}>
            <div className={styles.cmdropdown}>
              <button
                className={styles.guestProfilePic}
                onClick={() => handleLogout()}
              >
                <Link to="/login">
                  <span
                    className={`material-symbols-outlined ${styles.guestProfilePic}`}
                  >
                    local_police
                  </span>
                </Link>
              </button>
            </div>
            <button className={styles.navlinks}>
              <Link onClick={() => setAdminView(true)} to="/cm">
                Content Moderator View
              </Link>
            </button>
          </div>
        ) : (
          ""
        )}
        {userCtx.role === "admin" && adminView ? (
          <div className={`col ${styles.navigation}`}>
            <div className={styles.cmdropdown}>
              <button
                className={styles.guestProfilePic}
                onClick={() => handleLogout()}
              >
                <Link to="/login">
                  <span
                    className={`material-symbols-outlined ${styles.guestProfilePic}`}
                  >
                    local_police
                  </span>
                </Link>
              </button>
            </div>
            <button className={styles.navlinks}>
              <Link onClick={() => setAdminView(false)} to="/">
                User View
              </Link>
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </header>
  );
};

export default Navbar;
