const { Videos } = require("../models/Videos");

const seedVideo = async (req, res) => {
  try {
    await Videos.deleteMany({});

    await Videos.create([
      {
        title: "This CAT",
        description: "i love my cat",
        duration: 150, // Number indicated in seconds
        url: "https://via.placeholder.com/150",
        reported: false,
        likes: ["user1", "user2", "user3"], // Array of strings
        comments: [
          {
            id: 1,
            username: "user1",
            content: "this video sucks boo",
            created_at: 2025 - 11 - 11,
          },
        ],
        id: 1,
        created_at: 2025 - 11 - 12,
        uploaded_by_user: "user11",
      },
      {
        title: "This DOG",
        description: "i LOVE my dog",
        duration: 300, // Number indicated in seconds
        url: "https://via.placeholder.com/150",
        reported: true,
        likes: ["user1", "user2", "user3", "user4"], // Array of strings
        comments: [
          {
            id: 1,
            username: "user1",
            content: "this video sucks boo",
            created_at: 2025 - 11 - 11,
          },
          {
            id: 2,
            username: "user2",
            content: "i agree this video is bad boo",
            created_at: 2025 - 11 - 11,
          },
        ],
        id: 2,
        created_at: 2025 - 11 - 12,
        uploaded_by_user: "user69",
      },
    ]);
    res.json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    console.error(error.message);
    res.status(200).json({ status: "error", msg: "seeding failed" });
  }
};

const getVideos = async (req, res) => {
  try {
    const allVideos = await Videos.find();
    res.json(allVideos);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "can't get videos" });
  }
};

const addVideos = async (req, res) => {
  try {
    const newVideo = {
      id: req.body.id,
      created_at: req.body.created_at,
      uploaded_by_user: req.body.uploaded_by_user,
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      url: req.body.url,
      reported: req.body.reported,
      likes: req.body.likes,
      comments: [req.body.comments],
    };
    await Videos.create(newVideo);
    res.json({ status: "ok", msg: "video added" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to add video" });
  }
};

const updateVideo = async (req, res) => {
  try {
    const updatedVideo = {};
    if ("title" in req.body) updatedVideo.title = req.body.title;
    if ("description" in req.body)
      updatedVideo.description = req.body.description;
    await Videos.findByIdAndUpdate(req.params.id, updatedVideo);
    res.json({ status: "ok", msg: "video updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to update video" });
  }
};

module.exports = { seedVideo, getVideos, addVideos, updateVideo };