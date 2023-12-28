import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ image: '', caption: '' });
  const [comment, setComment] = useState(''); // New comment state

  // Fetch all posts from the server on component mount
  useEffect(() => {
    axios
      .get('https://social-media-clone-api.vercel.app/posts')
      .then((response) => setPosts(response.data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  // Function to handle upvoting a post
  const handleUpvote = (id) => {
    axios
      .put(`https://social-media-clone-api.vercel.app/posts/${id}/upvote`)
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === response.data._id ? response.data : post
        );
        setPosts(updatedPosts);
      })
      .catch((error) => console.error('Error upvoting post:', error));
  };

  // Function to handle downvoting a post
  const handleDownvote = (id) => {
    axios
      .put(`https://social-media-clone-api.vercel.app/posts/${id}/downvote`)
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === response.data._id ? response.data : post
        );
        setPosts(updatedPosts);
      })
      .catch((error) => console.error('Error downvoting post:', error));
  };

  // Function to handle submitting a new post
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('https://social-media-clone-api.vercel.app/posts', newPost)
      .then((response) => {
        setPosts([...posts, response.data]);
        setNewPost({ image: '', caption: '' });
      })
      .catch((error) => console.error('Error creating new post:', error));
  };

  // Function to handle submitting a new comment
  const handleCommentSubmit = (id) => {
    axios
      .put(`https://social-media-clone-api.vercel.app/posts/${id}/comment`, { comment })
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === response.data._id ? response.data : post
        );
        setPosts(updatedPosts);
        setComment('');
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  // Function to handle deleting a post
  const handleDeletePost = (id) => {
    axios
      .delete(`https://social-media-clone-api.vercel.app/posts/${id}`)
      .then(() => {
        const updatedPosts = posts.filter((post) => post._id !== id);
        setPosts(updatedPosts);
      })
      .catch((error) => console.error('Error deleting post:', error));
  };

  return (
    <div className="App">
      <h1>Caption Chaos: Your Goofy Post Playground</h1>

      {/* Form for adding a new post */}
      <form onSubmit={handleSubmit}>
        <label>
          Image URL:
          <input
            type="text"
            value={newPost.image}
            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
            required
            placeholder='Enter the Image Address'
          />
        </label>
        <label>
          Caption:
          <input
            type="text"
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
            placeholder='Enter a caption'
          />
        </label>
        <button type="submit" >Submit</button>
      </form>

      {/* List of posts */}
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <img src={post.image} alt="Post" />
            <p>{post.caption}</p>
            <div>
              <button onClick={() => handleUpvote(post._id)}>Upvote</button>
              <span>{post.upvote}</span>
              <button onClick={() => handleDownvote(post._id)}>Downvote</button>
            </div>

            {/* Input field for adding comments */}
            <div>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={() => handleCommentSubmit(post._id)} type="button">Comment</button>
            </div>

            {/* Display comments */}
            <ul>
              {post.comment.map((c, index) => (
                <li key={index} className='comments'>{c}</li>
              ))}
            </ul>

            {/* Button to delete the post */}
            <button
              onClick={() => handleDeletePost(post._id)}
              className="delete-button"
            >
              Delete Post
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
