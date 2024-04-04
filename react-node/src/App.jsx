import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DirectMessage from "./pages/DirectMessage";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import ContentModerator from "./pages/ContentModerator";
import UserContext from "./context/user";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  return (
    <>
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          role,
          setRole,
          username,
          setUsername,
          profilePic,
          setProfilePic,
        }}
      >
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Navigate replace to="/main" />} />
          <Route path="main" element={<HomePage></HomePage>} />
          <Route path="login" element={<LoginPage></LoginPage>} />
          <Route path="register" element={<RegisterPage></RegisterPage>} />
          <Route path="dm" element={<DirectMessage></DirectMessage>} />
          <Route path="profile/:currentUser" element={<Profile></Profile>} />
          <Route path="upload" element={<Upload></Upload>} />
          <Route path="cm" element={<ContentModerator></ContentModerator>} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
