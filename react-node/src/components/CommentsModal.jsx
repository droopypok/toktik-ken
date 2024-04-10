import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import styles from "./CommentsModal.module.css";
import UserContext from "../context/user";
import Comments from "./Comments";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import FlagIcon from "@mui/icons-material/Flag";
import ShareIcon from "@mui/icons-material/Share";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [userPP, setUserPP] = useState("");
  const [comments, setComments] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [likes, setLikes] = useState([]);
  const [color, setColor] = useState("white");
  const [videoLiked, setVideoLiked] = useState(false);
  const [reported, setReported] = useState(false);
  const [reportColor, setReportColor] = useState("white");
  const [isPaused, setIsPaused] = useState(false);

  const commentRef = useRef("");
  const modalRef = useRef(null);

  // need to edit date & time ( throw to gabrielle hehe )

  const dateConvert = (dateString) => {
    const isoDate = dateString;
    const date = new Date(isoDate);
    const formatDate = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
    return formatDate;
  };

  const getProfileData = async () => {
    const res = await fetchData("/videos/getvideo", "PUT", {
      id: props.id,
    });
    if (res.ok) {
      setLikes(res.data.likes);
      setComments(res.data.comments);
      getUserDetails();
    }
  };

  const getUserDetails = async () => {
    const res = await fetchData(
      "/users/user/" + props.username,
      "POST",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setUserPP(res.data.profilePicture);
    }
  };

  const addComments = async (id) => {
    const res = await fetchData(
      "/comments/" + props.id,
      "PUT",
      {
        parentId: id,
        username: userCtx.username,
        profilePicture: userCtx.profilePic,
        content: commentRef.current.value,
        replies: [],
      },
      userCtx.accessToken
    );
    if (res.ok) {
      getProfileData();
    }
  };

  const addReply = async (id) => {
    if (commentRef.current.value) {
      const res = await fetchData(
        "/comments/replies/" + props.id,
        "POST",
        {
          parentId: id,
          username: userCtx.username,
          profilePicture: userCtx.profilePic,
          content: commentRef.current.value,
        },
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(id);
        getProfileData();
      }
    }
  };

  const handleSubmitComment = (id) => {
    addComments(id);
    setShowInput(false);
    commentRef.current.value = "";
  };

  // click outside and close modal and reported set
  useEffect(() => {
    getProfileData();
    modalRef.current.value = document.querySelector("#outside");
    setReported(props.reported);
  }, []);

  useEffect(() => {
    if (likes.includes(userCtx.username)) {
      setVideoLiked(true);
      setColor("red");
    } else {
      setColor("white");
    }

    if (reported) {
      setReportColor("yellow");
    } else {
      setReportColor("white");
    }
  }, [likes, reported]);

  const handleCloseModal = () => {
    if (modalRef) {
      modalRef.current.addEventListener("click", (e) => {
        if (modalRef.current === e.target.value) {
          props.setShowCommentsModal(false);
        }
      });
    }
  };

  const handleSubmitReply = (e, id) => {
    e.preventDefault();
    addReply(id);
    setShowInput(false);
    commentRef.current.value = "";
  };

  const reportVideo = async (flaggedId) => {
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
      props.setShowCommentsModal(false);
    }
    props.handleReportChange(flaggedId, !reported);
    // to update source of truth in parent (homepage)
  };

  const handleLikeClick = async (likeId) => {
    if (videoLiked === false) {
      const res = await fetchData(
        "/videos/likes/" + likeId,
        "PUT",
        { username: userCtx.username },
        userCtx.accessToken
      );

      if (res.ok) {
        console.log("am i here");
        setVideoLiked(true);
        getProfileData();
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
        getProfileData();
      }
    }
  };

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

  //delete fetch
  const deleteComment = async (id, parentId) => {
    const res = await fetchData(
      "/comments/delete/" + props.id,
      "PATCH",
      {
        parentId: parentId,
        id: id,
      },
      userCtx.accessToken
    );
    if (res.ok) {
      getProfileData();
    } else {
      console.log("ERROR IN DELETE COMMENT");
    }
  };

  const deleteReply = async (id, parentId) => {
    const res = await fetchData(
      "/comments/" + props.id,
      "DELETE",
      {
        parentId: parentId,
        id: id,
      },
      userCtx.accessToken
    );
    if (res.ok) {
      console.log(res);
      getProfileData();
    }
  };

  const handleDeleteComments = (id, parentId) => {
    deleteComment(id, parentId);
  };

  const handleDeleteReplies = (id, parentId) => {
    deleteReply(id, parentId);
  };

  return (
    <>
      <div
        id="outside"
        className={styles.backdrop}
        ref={modalRef}
        onClick={() => handleCloseModal()}
      >
        <div className={`${styles.modalContainer} row`}>
          <div className={`${styles.videoContainer} col`}>
            <div className={styles.buttonContainer}>
              <button>
                <FavoriteIcon
                  style={{ fill: color, zIndex: 1000000 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLikeClick(props.id);
                  }}
                ></FavoriteIcon>
                <p>{likes.length}</p>
              </button>

              <button
                onClick={() => {
                  reportVideo(props.id);
                }}
              >
                <FlagIcon
                  style={{ fill: reportColor, zIndex: 1000 }}
                ></FlagIcon>
              </button>

              <button>
                <ShareIcon></ShareIcon>
              </button>
            </div>

            <video
              className={styles.video}
              src={props.url}
              onClick={(event) => {
                handlePlayer(event);
              }}
              autoPlay
              loop={true}
            ></video>

            {isPaused && (
              <div className={styles.pauseBtn}>
                <PauseRoundedIcon></PauseRoundedIcon>
              </div>
            )}
          </div>

          <div className={`${styles.modal} col`}>
            <div className={styles.mainTitle}>
              <img className={styles.pp} src={userPP} />
              <div className={styles.usernameTitle}>
                <div style={{ fontWeight: "bold" }}>{props.username}</div>
                <div>{props.title}</div>

                <div className={styles.miscellaneous}>
                  <div className={styles.dateTime}>
                    {dateConvert(props.created_at)}
                  </div>
                  <div
                    className={styles.reply}
                    onClick={() => {
                      setShowInput(true);
                    }}
                  >
                    Reply
                  </div>
                </div>
              </div>
            </div>

            {showInput && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitComment(props.id);
                }}
              >
                <input
                  className={`${styles.input}`}
                  type="text"
                  ref={commentRef}
                  placeholder="comment"
                  autoFocus
                  onBlur={() => {
                    commentRef.current.value = "";
                    setShowInput(false);
                  }}
                />
              </form>
            )}

            {/* comments */}
            <div className={styles.commentsContainer}>
              <div>
                {comments
                  ? comments.map((item) => {
                      return (
                        <Comments
                          key={item._id}
                          handleSubmitReply={handleSubmitReply}
                          comments={item}
                          commentRef={commentRef}
                          id={item._id}
                          handleDeleteReplies={handleDeleteReplies}
                          handleDeleteComments={handleDeleteComments}
                          parentId={item.parentId}
                          username={props.username}
                        ></Comments>
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CommentsModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          setShowCommentsModal={props.setShowCommentsModal}
          id={props.id}
          url={props.url}
          username={props.username}
          title={props.title}
          created_at={props.created_at}
          likes={props.likes}
          comments={props.comments}
          handleReportChange={props.handleReportChange}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CommentsModal;
