import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import "../../Css/DetailStory.css";
import Loader from '../GeneralScreens/Loader';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit, FiArrowLeft } from 'react-icons/fi';
import { FaRegComment } from 'react-icons/fa';
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs';
import CommentSidebar from '../CommentScreens/CommentSidebar';

// ✅ API instance after all imports
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://bloggy-e52g.onrender.com'
});

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeUser, setActiveUser] = useState({});
  const [story, setStory] = useState({});
  const [storyLikeUser, setStoryLikeUser] = useState([]);
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const slug = useParams().slug;
  const [storyReadListStatus, setStoryReadListStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getDetailStory = async () => {
      setLoading(true);
      let activeUserData = {};
      try {
        const { data } = await API.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUserData = data.user;
        setActiveUser(activeUserData);
      } catch {
        setActiveUser({});
      }

      try {
        const { data } = await API.post(`/story/${slug}`, { activeUser: activeUserData });
        setStory(data.data);
        setLikeStatus(data.likeStatus);
        setLikeCount(data.data.likeCount);
        setStoryLikeUser(data.data.likes);
        setLoading(false);

        const story_id = data.data._id;
        setStoryReadListStatus(activeUserData.readList?.includes(story_id) || false);

      } catch {
        setStory({});
        navigate("/not-found");
      }
    };
    getDetailStory();
  }, [slug, navigate]);

  const handleLike = async () => {
    setTimeout(() => setLikeStatus(!likeStatus), 1500);
    try {
      const { data } = await API.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setLikeCount(data.data.likeCount);
      setStoryLikeUser(data.data.likes);
    } catch {
      setStory({});
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Do you want to delete this post?")) return;
    try {
      await API.delete(`/story/${slug}/delete`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    return d.toLocaleString('en', { month: 'short' }) + " " + d.getDate();
  };

  const addStoryToReadList = async () => {
    try {
      const { data } = await API.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setStoryReadListStatus(data.status);
      document.getElementById("readListLength").textContent = data.user.readListLength;
    } catch (error) {
      console.error(error);
    }
  };

  return loading ? <Loader /> : (
    <div className='Inclusive-detailStory-page'>
      {/* ...rest of your JSX code remains the same */}
    </div>
  );
};

export default DetailStory;
