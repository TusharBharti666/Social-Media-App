import { createSlice } from "@reduxjs/toolkit"; // all these below are just functions for modifying the global state

// this is the initial state of auth, where we have no user ,no posts, no token and mode is light mode by default
const initialState = {

    mode: "light",
    user: null,
    token: null,
    posts: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // setMode is changing the mode from light to dark or vice-versa
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        // here we are grabbing the token and user from our payload and adding them in our user and token holder when someone logged in 
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        // here we don't need action, just set state as null for both of them
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        // if user exists in the first place , add his/her friends in their list or return a error message
        setFriends: (state, action) => {
            if(state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("user friends non-existent :(");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if(post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        }
    }
})

// destructure all the actions we have used from authSlice
export const { setMode, setFriends, setLogin, setLogout, setPost, setPosts } = authSlice.actions;
export default authSlice.reducer;