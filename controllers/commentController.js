import Video from "../models/Video.model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * =======================================================
 * ADD COMMENT TO VIDEO
 * =======================================================
 * Flow:
 * 1. Extract videoId and comment details
 * 2. Validate that video exists
 * 3. Create a new comment object with UUID
 * 4. Push into comments array and save
 * 5. Return the newly created comment
 */
export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId, username, avatar, text } = req.body;

    // Check if video exists
    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Construct new comment object
    const newComment = {
      commentId: uuidv4(),
      userId,
      username,
      avatar,
      text,
      timestamp: new Date(),
    };

    // Add comment to video
    video.comments.push(newComment);
    await video.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * EDIT COMMENT
 * =======================================================
 * Flow:
 * 1. Extract videoId, commentId, and new text
 * 2. Validate video and comment existence
 * 3. Ensure only the comment owner can edit
 * 4. Update text and save video
 * 5. Return full video object (updated)
 */
export const editComment = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId; // from auth middleware

    // Find the video
    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Find the specific comment
    const comment = video.comments.find((c) => c.commentId === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment owner can edit
    if (comment.userId !== userId)
      return res.status(403).json({ message: "Not allowed" });

    // Update comment text
    comment.text = text;

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * DELETE COMMENT
 * =======================================================
 * Flow:
 * 1. Extract videoId and commentId
 * 2. Validate video & comment existence
 * 3. Ensure only owner can delete
 * 4. Filter out the deleted comment
 * 5. Save and return updated video
 */
export const deleteComment = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const userId = req.user.userId;

    // Find the video
    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Find the comment
    const comment = video.comments.find((c) => c.commentId === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment owner can delete
    if (comment.userId !== userId)
      return res.status(403).json({ message: "Not allowed" });

    // Remove comment
    video.comments = video.comments.filter((c) => c.commentId !== commentId);

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
