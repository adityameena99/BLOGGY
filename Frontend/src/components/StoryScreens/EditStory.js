import React, { useEffect, useState, useRef, useContext } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Loader from '../GeneralScreens/Loader';
import { AiOutlineUpload } from 'react-icons/ai';
import { AuthContext } from "../../Context/AuthContext";
import '../../Css/EditStory.css';
import axios from 'axios';

// ✅ API instance after all imports
// API instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://bloggy-rie5.onrender.com",
  withCredentials: true
});

const EditStory = () => {
  const { config } = useContext(AuthContext);
  const slug = useParams().slug;
  const imageEl = useRef(null);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState({});
  const [image, setImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getStoryInfo = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/story/editStory/${slug}`, config);
        setStory(data.data);
        setTitle(data.data.title);
        setContent(data.data.content);
        setImage(data.data.image);
        setPreviousImage(data.data.image);
        setLoading(false);
      } catch {
        navigate("/");
      }
    };
    getStoryInfo();
  }, [slug, config, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("content", content);
    formdata.append("image", image);
    formdata.append("previousImage", previousImage);

    try {
      await API.put(`/story/${slug}/edit`, formdata, config);
      setSuccess('Edit Story successfully');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setTimeout(() => setError(''), 4500);
    }
  };

  return loading ? <Loader /> : (
    <div className="Inclusive-editStory-page">
      <form onSubmit={handleSubmit} className="editStory-form">
        {error && <div className="error_msg">{error}</div>}
        {success && <div className="success_msg">
          <span>{success}</span>
          <Link to="/">Go home</Link>
        </div>}

        <input
          type="text"
          required
          id="title"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(e, editor) => setContent(editor.getData())}
        />

        <div className="currentlyImage">
          <div className="absolute">Currently Image</div>
          <img
            src={`${process.env.REACT_APP_API_URL || 'https://bloggy-rie5.onrender.com'}/storyImages/${previousImage}`}
            alt="storyImage"
          />
        </div>

        <div className="StoryImageField">
          <AiOutlineUpload />
          <div className="txt">
            {image === previousImage ? "Change the image in your story" : image.name}
          </div>
          <input
            name="image"
            type="file"
            ref={imageEl}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type='submit' className='editStory-btn'>Edit Story</button>
      </form>
    </div>
  );
};

export default EditStory;
