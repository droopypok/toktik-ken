import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Video.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import FlagIcon from "@mui/icons-material/Flag";
import ShareIcon from "@mui/icons-material/Share";
import useFetch from "../hooks/useFetch";
import CommentsModal from "./CommentsModal";
import UserContext from "../context/user";
import { useInView } from "react-intersection-observer";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

const Video = (props) => {
  const fetchData = useFetch();
  // state to track color
  const [color, setColor] = useState("white");
  // state to track reported status
  const [reported, setReported] = useState(props.video.reported);
  // state to track number of likes
  const [liked, setLiked] = useState([]);
  // state to track whether a video has been liked
  const [videoLiked, setVideoLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [profilePic, setProfilePic] = useState("");

  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const videoRef = useRef(null);

  useEffect(() => {
    if (!showCommentsModal) {
      getSpecificVideo();
    }
  }, [showCommentsModal]);

  useEffect(() => {
    const videoThing = videoRef.current;
    if (showCommentsModal) {
      setIsPaused(true);
      videoThing.pause();
    } else if (inView) {
      setIsPaused(false);
      videoThing.play();
    } else {
      setIsPaused(true);
      videoThing.pause();
    }
  }, [inView, showCommentsModal]);

  useEffect(() => {
    setLiked(props.likes);
    getUserDetails();
  }, []);

  useEffect(() => {
    if (liked.includes(userCtx.username)) {
      setVideoLiked(true);
      setColor("red");
    } else {
      setColor("white");
    }
  }, [liked]);

  const handlePlayer = (event) => {
    event.preventDefault();
    if (event.currentTarget.paused) {
      setIsPaused(false);
      event.target.play();
    } else {
      setIsPaused(true);
      event.target.pause();
    }
  };

  const handleCommentsClick = () => {
    if (userCtx.accessToken.length > 0) {
      return setShowCommentsModal(true);
    } else {
      return navigate("/login");
    }
  };

  // function to change color
  const colorChangeFavourite = () => {
    if (videoLiked) {
      setColor("red");
    } else {
      setColor("white");
    }
  };

  const getSpecificVideo = async () => {
    const res = await fetchData(
      "/videos/getvideo/",
      "PUT",
      {
        id: props.id,
      },
      userCtx.accessToken
    );
    if (res.ok) {
      setLiked(res.data.likes);
      setComments(res.data.comments);
    }
  };

  // function to increase like
  const handleLikeClick = async (likeId) => {
    if (userCtx.accessToken.length === 0) {
      return navigate("/login");
    }
    if (videoLiked === false) {
      const res = await fetchData(
        "/videos/likes/" + likeId,
        "PUT",
        { username: userCtx.username },
        userCtx.accessToken
      );

      if (res.ok) {
        setVideoLiked(true);
        getSpecificVideo();
      }
    } else if (videoLiked === true) {
      const res = await fetchData(
        "/videos/likes/remove/" + likeId,
        "PUT",
        { username: userCtx.username },
        userCtx.accessToken
      );
      if (res.ok) {
        setVideoLiked(false);
        getSpecificVideo();
      }
    }
  };

  // function for report button
  const reportVideo = async (flaggedId) => {
    if (userCtx.accessToken.length === 0) {
      return navigate("/login");
    }
    const res = await fetchData(
      "/videos/flagged/" + flaggedId,
      "PATCH",
      {
        reported: !reported,
      },
      userCtx.accessToken
    );
    if (res.ok) {
      setReported(reported);
      // to change color
      // colorChange();
    }
    // to update source of truth in parent (homepage)
    props.handleReportChange(flaggedId, !reported);
  };

  const getUserDetails = async () => {
    const res = await fetchData(
      "/users/user/" + props.video.username,
      "POST",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setProfilePic(res.data.profilePicture);
    }
  };

  useEffect(() => {}, [showCommentsModal, liked]);

  return (
    <>
      {showCommentsModal && (
        <CommentsModal
          id={props.id}
          username={props.video.username}
          url={props.video.url}
          setShowCommentsModal={setShowCommentsModal}
          title={props.video.title}
          created_at={props.video.created_at}
          showCommentsModal={showCommentsModal}
          likes={props.likes}
          comments={props.comments}
          handleReportChange={props.handleReportChange}
          reported={props.video.reported}
        ></CommentsModal>
      )}

      <div ref={ref} className={styles.videoDisplay}>
        <div className={styles.uploadDetails}>
          <img
            className={profilePic ? styles.pp : ""}
            src={profilePic}
            alt=""
          />

          {userCtx.accessToken ? (
            <Link
              to={`/profile/${props.video.username}`}
              className={styles.username}
            >
              {props.video.username}
            </Link>
          ) : (
            <Link to={"/login"} className={styles.username}>
              {props.video.username}
            </Link>
          )}

          <div className={styles.title}>{props.video.title}</div>
        </div>

        {userCtx.role === "user" && (
          <>
            <button
              style={{
                position: "absolute",
                right: "1vw",
                bottom: "25vh",
                fontSize: "1rem",
                zIndex: 10,
                backgroundColor: "transparent",
                borderColor: "transparent",
                height: "3rem",
              }}
              onClick={colorChangeFavourite}
            >
              <FavoriteIcon
                style={{ fill: color }}
                onClick={(e) => {
                  e.preventDefault();
                  handleLikeClick(props.video._id);
                }}
              ></FavoriteIcon>
              <p>{liked.length}</p>
            </button>
            <button
              style={{
                position: "absolute",
                right: "1vw",
                bottom: "17vh",
                fontSize: "1rem",
                zIndex: 10,
                backgroundColor: "transparent",
                borderColor: "transparent",
                height: "3rem",
              }}
              onClick={() => handleCommentsClick()}
            >
              <CommentIcon></CommentIcon>
              <p>{comments.length}</p>
            </button>
            <button
              style={{
                position: "absolute",
                right: "1vw",
                bottom: "11vh",
                fontSize: "1rem",
                backgroundColor: "transparent",
                borderColor: "transparent",
                zIndex: 10,
              }}
              onClick={() => reportVideo(props.video._id)}
            >
              <FlagIcon></FlagIcon>
            </button>
            <button
              style={{
                position: "absolute",
                right: "1vw",
                bottom: "5vh",
                fontSize: "1rem",
                backgroundColor: "transparent",
                borderColor: "transparent",
                zIndex: 10,
              }}
            >
              <ShareIcon></ShareIcon>
            </button>{" "}
          </>
        )}

        <video
          ref={videoRef}
          className={styles.videoPlayer}
          src={props.video.url}
          onClick={(event) => {
            handlePlayer(event);
          }}
          loop={true}
        ></video>

        {isPaused && (
          <div className={styles.pauseBtn}>
            <PauseRoundedIcon></PauseRoundedIcon>
          </div>
        )}
      </div>
    </>
  );
};

export default Video;
