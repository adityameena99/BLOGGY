import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import axios from "axios"
import "../../Css/DetailStory.css"
import Loader from "../GeneralScreens/Loader"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FiEdit, FiArrowLeft } from "react-icons/fi"
import { FaRegComment } from "react-icons/fa"
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from "react-icons/bs"
import CommentSidebar from "../CommentScreens/CommentSidebar"

// API instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://bloggy-rie5.onrender.com",
  withCredentials: true,
})

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [activeUser, setActiveUser] = useState({})
  const [story, setStory] = useState({})
  const [storyLikeUser, setStoryLikeUser] = useState([])
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const slug = useParams().slug
  const [storyReadListStatus, setStoryReadListStatus] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getDetailStory = async () => {
      setLoading(true)
      let activeUserData = {}
      try {
        const { data } = await API.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        activeUserData = data.user
        setActiveUser(activeUserData)
      } catch {
        setActiveUser({})
      }

      try {
        const { data } = await API.post(`/story/${slug}`, { activeUser: activeUserData })
        setStory(data.data)
        setLikeStatus(data.likeStatus)
        setLikeCount(data.data.likeCount)
        setStoryLikeUser(data.data.likes)
        setLoading(false)

        const story_id = data.data._id
        setStoryReadListStatus(activeUserData.readList?.includes(story_id) || false)
      } catch {
        setStory({})
        navigate("/not-found")
      }
    }
    getDetailStory()
  }, [slug, navigate])

  const handleLike = async () => {
    setTimeout(() => setLikeStatus(!likeStatus), 1500)
    try {
      const { data } = await API.post(
        `/story/${slug}/like`,
        { activeUser },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      )
      setLikeCount(data.data.likeCount)
      setStoryLikeUser(data.data.likes)
    } catch {
      setStory({})
      localStorage.removeItem("authToken")
      navigate("/")
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Do you want to delete this post?")) return
    try {
      await API.delete(`/story/${slug}/delete`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      navigate("/")
    } catch (error) {
      console.error(error)
    }
  }

  const editDate = (createdAt) => {
    const d = new Date(createdAt)
    return d.toLocaleString("en", { month: "short" }) + " " + d.getDate()
  }

  const addStoryToReadList = async () => {
    try {
      const { data } = await API.post(
        `/user/${slug}/addStoryToReadList`,
        { activeUser },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      )
      setStoryReadListStatus(data.status)
      document.getElementById("readListLength").textContent = data.user.readListLength
    } catch (error) {
      console.error(error)
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <div className="Inclusive-detailStory-page">
      {/* Header and Back Button */}
      <div className="top_story_transactions">
        <Link to="/">
          <FiArrowLeft />
        </Link>
      </div>

      {/* Story Title */}
      <div className="top_detail_wrapper">
        <h5>{story.title}</h5>
      </div>

      {/* Story Info Bar */}
      <div className="story-general-info">
        <ul>
          <li className="story-author-info">
            <img
              src={`${process.env.REACT_APP_API_URL || "https://bloggy-rie5.onrender.com"}/userPhotos/${story.user?.photo || "user.png"}`}
              alt={story.user?.fullname}
            />
            <span>{story.user?.fullname}</span>
            <b>•</b>
          </li>
          <li className="story-createdAt">{editDate(story.createdAt)}</li>
          <li className="story-readtime">{story.readTime || "5"} min read</li>
        </ul>
      </div>

      {/* Story Banner Image */}
      <div className="story-banner-img">
        <img
          src={`${process.env.REACT_APP_API_URL || "https://bloggy-rie5.onrender.com"}/storyImages/${story.image}`}
          alt={story.title}
        />
      </div>

      {/* Story Content */}
      <div className="story-content">
        <div className="content" dangerouslySetInnerHTML={{ __html: story.content }} />
      </div>

      {/* Bottom Section with Actions */}
      <div className="bottom-sec-item">
        <ul>
          <li>
            <i onClick={handleLike}>{likeStatus ? <FaHeart style={{ color: "red" }} /> : <FaRegHeart />}</i>
            <b>{likeCount}</b>
          </li>
          <li className="comment-info-wrap">
            <i onClick={() => setSidebarShowStatus(!sidebarShowStatus)}>
              <FaRegComment />
            </i>
            <b>{story.commentCount || 0}</b>
          </li>
          <li>
            <i onClick={addStoryToReadList}>{storyReadListStatus ? <BsBookmarkFill /> : <BsBookmarkPlus />}</i>
            <b id="readListLength">{activeUser.readListLength || 0}</b>
          </li>
        </ul>

        {/* Edit/Delete Options */}
        {activeUser._id === story.user?._id && (
          <div className="BsThreeDots_opt">
            <i>
              <BsThreeDots />
            </i>
            <div className="delete_or_edit_story">
              <Link to={`/story/${slug}/edit`}>
                <p>
                  <FiEdit /> Edit
                </p>
              </Link>
              <p onClick={handleDelete}>
                <RiDeleteBin6Line /> Delete
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed-story-options">
        <ul>
          <li>
            <i onClick={handleLike}>{likeStatus ? <FaHeart style={{ color: "red" }} /> : <FaRegHeart />}</i>
            <b>{likeCount}</b>
          </li>
          <li>
            <i onClick={() => setSidebarShowStatus(!sidebarShowStatus)}>
              <FaRegComment />
            </i>
            <b>{story.commentCount || 0}</b>
          </li>
          <li>
            <i onClick={addStoryToReadList}>{storyReadListStatus ? <BsBookmarkFill /> : <BsBookmarkPlus />}</i>
            <b id="readListLength">{activeUser.readListLength || 0}</b>
          </li>
        </ul>

        {activeUser._id === story.user?._id && (
          <div className="BsThreeDots_opt">
            <i>
              <BsThreeDots />
            </i>
            <div className="delete_or_edit_story">
              <Link to={`/story/${slug}/edit`}>
                <p>
                  <FiEdit /> Edit
                </p>
              </Link>
              <p onClick={handleDelete}>
                <RiDeleteBin6Line /> Delete
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comment Sidebar */}
      {sidebarShowStatus && <CommentSidebar slug={slug} />}
    </div>
  )
}

export default DetailStory
