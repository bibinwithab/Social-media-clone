import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'; // Import Axios

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ image: '', caption: '' });

  // Fetch all posts from the server on component mount
  useEffect(() => {
    axios
      .get('http://localhost:8000/posts') // Use Axios for GET request
      .then((response) => setPosts(response.data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  // Function to handle upvoting a post
  const handleUpvote = (id) => {
    // Send a PUT request to upvote a post using Axios
    axios
      .put(`http://localhost:8000/posts/${id}/upvote`)
      .then((response) => {
        // Update the state with the updated post
        const updatedPosts = posts.map((post) =>
          post._id === response.data._id ? response.data : post
        );
        setPosts(updatedPosts);
      })
      .catch((error) => console.error('Error upvoting post:', error));
  };

  // Function to handle downvoting a post
  const handleDownvote = (id) => {
    // Send a PUT request to downvote a post using Axios
    axios
      .put(`http://localhost:8000/posts/${id}/downvote`)
      .then((response) => {
        // Update the state with the updated post
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
    // Send a POST request to create a new post using Axios
    axios
      .post('http://localhost:8000/posts', newPost)
      .then((response) => {
        // Add the new post to the state
        setPosts([...posts, response.data]);
        // Clear the form fields
        setNewPost({ image: '', caption: '' });
      })
      .catch((error) => console.error('Error creating new post:', error));
  };

  return (
    <div className="App">
      <h1>Reddit-Inspired Post Management</h1>

      {/* Form for adding a new post */}
      <form onSubmit={handleSubmit}>
        <label>
          Image URL:
          <input
            type="text"
            value={newPost.image}
            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
            required
          />
        </label>
        <label>
          Caption:
          <input
            type="text"
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
          />
        </label>
        <button type="submit">Submit</button>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
