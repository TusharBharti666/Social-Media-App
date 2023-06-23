import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  // this how we grab all the posts from the backend, that's why we are performing GET req
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }, // to validate the api call
    });
    const data = await response.json(); // converting the data into json, to send it back to the frontend  
    dispatch(setPosts({ posts: data }));
  };

  // grabbing just the user specific posts from the backend
  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }, // to validate the api call
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  // if we are inside a user profile that means we have to call for getUserPosts to get specific posts
  //otherwise we are in general feed , here we have to show all the posts
  // providing empty array in the useEffect so that it runs only one time
  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // for showing each posts we have to create individual containers for holding every post
  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;


// PostsWidget is going to do two things, one is that on the homePage it is going
// to grab all the posts from all the users ( performing the api call = posts.js(8th line) , inside thr routes )


// but if u go on a profile of a specific user than we have to show only the posts 
// of that user (making the api call = posts.js(9th line), inside routes folder )