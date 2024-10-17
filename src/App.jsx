import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {


  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState({ title: "", content: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPosiId, setCurrentPostId] = useState(null);



  //  Get the Data From Endpoint with the help of json server and axios

  useEffect(() => {
    axios.get("http://localhost:3000/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log("Something went wrong"));
  }, [])

  // Post the New Data

  const addPost = () => {

    axios.post("http://localhost:3000/posts", newPosts)
      .then((res) => {
        setPosts([...posts, res.data])
        setNewPosts({ title: "", content: "" })
      }).catch((err) => console.log("Something went wrong"));

  }


  const handleSubmit = () => {

    if (isUpdating) {
      updatePost()
    } else {
      addPost();
    }
  }

  // put Request

  const updatePost = ()=>{
    axios.put(`http://localhost:3000/posts/${currentPosiId}`, newPosts )
    .then((res) => {
      setPosts(posts.map((post)=>(post.id === currentPosiId ? res.data:post)))
      setIsUpdating(false)
      setCurrentPostId(null)
    })
    .catch((err) => console.log("Something Went wrorng"));
  }



  // Fill Form with post data when clicking for "update"

  const handleEditCllick = (post) => {


    setNewPosts({ title: post.title, content: post.content });
    setIsUpdating(true);
    setCurrentPostId(post.id);

  }


  //  Delete post

  const deletePost = (id) => {

    axios.delete(`http://localhost:3000/posts/${id}`)
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
      })
      .catch((err) => console.log("Something went wrong"))
  }


  return (
    <>
    <div className='crud p-4'>
      <nav className='navbar navbar-expand-lg navbar-light bg-black bg-gradient px-5 rounded'>
        <a href="#" className='navbar-brand'>
          <h2 className='text-white'>CRUD Post Manager</h2>
        </a>
      </nav>
      <div className='container my-4 mb-4 bg-gradient p-4 rounded-5'>
        <div className='mb-5'>
          <input type="text" className='form-control mb-2' placeholder='Enter the Title' value={newPosts.title} onChange={(e) => setNewPosts({ ...newPosts, title: e.target.value })} />
          <input type="text" className='form-control mb-2' placeholder='Enter the Content' value={newPosts.content} onChange={(e) => setNewPosts({ ...newPosts, content: e.target.value })} />
          <button className=' btn btn-outline-success text-black ' onClick={handleSubmit} >  {isUpdating ? "Update Post" : "Add post"} </button>
        </div>

        <ul className='list-group mb-4'>
          {posts.map((post) => (


            <li key={post.id} className='list-group-item mb-4 rounded bg-success bg-gradient '>
              <h2>{post.title}</h2>
              <p>{post.content}</p>

              <div className='d-flex gap-3'>
                <button className='btn btn-outline-warning text-black' onClick={() => handleEditCllick(post)}>Update</button>
                <button className='btn btn-outline-danger text-black' onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </>
  )
}

export default App 
