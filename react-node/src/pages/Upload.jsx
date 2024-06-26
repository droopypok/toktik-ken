import React, { useContext, useEffect, useRef, useState } from "react";
import "./Upload.css";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useFetch from "../hooks/useFetch";

const Upload = () => {
  const userCtx = useContext(UserContext);

  // const fetchData = useFetch();
  const navigate = useNavigate();

  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(false);

  const inputRef = useRef();

  // post to backend
  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("fileName", file);
    formData.append("title", title);
    formData.append("username", userCtx.username);

    console.log(formData);

    try {
      const res = await fetch("http://127.0.0.1:6001/videos/videoupload", {
        method: "POST",
        headers: { Authorization: "Bearer " + userCtx.accessToken },
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      console.log(data);
      goToHomePage();
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  // handle on change for file upload
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  // function to navigate back to homepage after uploading
  const goToHomePage = (event) => {
    // event.preventDefault();

    navigate("/main");
  };

  useEffect(() => {
    if (userCtx.accessToken.length === 0) {
      return navigate("/login");
    }

    if (!file) {
      setPreview(undefined);
      return;
    }
    // to generate the video preview
    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);
    return () => URL.revokeObjectURL(fileUrl);
  }, [file]);

  return (
    <>
      <div className="container">
        <input
          ref={inputRef}
          onChange={handleFileChange}
          type="file"
          accept="image/*,video/*"
          style={{ display: "none" }}
        ></input>
        {!file && (
          <>
            <button className="file-btn" onClick={onChooseFile}>
              <span>
                <CloudUploadIcon
                  style={{
                    marginTop: "10px",
                  }}
                ></CloudUploadIcon>
              </span>
              Upload File
            </button>
          </>
        )}
        <form onSubmit={submit}>
          {file && (
            <>
              <input
                className="title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Content"
                style={{ color: "white" }}
              ></input>
              <div className="preview-container">
                <div
                  className="video-preview-header"
                  style={{ color: "#cacaca" }}
                >
                  <h6>Video Preview</h6>
                </div>
                <video className="uploaded-video" src={preview} />
              </div>
              <div className="input-container">
                <button className="post-button" type="submit">
                  Post
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Upload;
