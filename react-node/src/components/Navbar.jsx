import { React, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import UserContext from "../context/user";

const Navbar = () => {
  const userCtx = useContext(UserContext);

  return (
    <header className={styles.navbar}>
      <div className={`row ${styles.container}`}>
        <div className={`col ${styles.logo}`}>
          <Link to="/main">
            <img
              className={styles.toktiklogo}
              src="https://fontmeme.com/permalink/240402/d3d95be2d8e76c275d690618dd82def0.png"
              alt=""
            />
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
                <Link to="/profile"> Profile </Link>
                <Link to="/login"> Logout </Link>
              </div>
            </div>

            <button className={styles.navlinks}>
              <Link to="/dm">
                <span
                  className={`material-symbols-outlined ${styles.userIcon}`}
                >
                  mail
                </span>
              </Link>
            </button>

            <button className={styles.navlinks}>
              <Link to="/upload">
                <span
                  className={`material-symbols-outlined ${styles.userIcon}`}
                >
                  add
                </span>
              </Link>
            </button>
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

        {/* {userCtx.role === "admin" && location.pathname === "/cm" ? (
          <div className={`col ${styles.navigation}`}>
            <button className={styles.guestProfilePic}>
              <span
                className={`material-symbols-outlined ${styles.guestProfilePic}`}
              >
                local_police
              </span>
            </button>
            <button className={styles.navlinks}>
              <Link to="/">User View</Link>
            </button>
          </div>
        ) : (
          <div className={`col ${styles.navigation}`}>
            <button className={styles.guestProfilePic}>
              <Link to="/register">
                <span
                  className={`material-symbols-outlined ${styles.guestProfilePic}`}
                >
                  local_police
                </span>
              </Link>
            </button>
            <button className={styles.navlinks}>
              <Link to="/cm">Content Moderator View</Link>
            </button>
          </div>
        )} */}
      </div>
    </header>
  );
};

export default Navbar;
