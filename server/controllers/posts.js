import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE //

export const createPost = async (req, res) => {
    
    // grabbing the userId, description and picturePath from the body and creating a new post by adding all the info into the post schema
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findbyId(userId);
        const newPost = new Post({

            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []

        })
        await newPost.save();

        const post = await Post.find(); // after adding the post by the user, we update all the feed and return it to the frontend
        res.status(201).json(post);
    }
    catch(err) {
        res.status(409).json({message: err.message});
    }
}

// READ //

export const getFeedPosts = async (req, res) => {

    try {

        const post = await Post.find(); // after adding the post by the user, we update all the feed and return it to the frontend
        res.status(200).json(post);

    }
    catch(err) {
        res.status(404).json({message: err.message});
    }
}

// will only grab particular user's post whose id we have given
export const getUserPosts = async (req, res) => {
    
    try {

        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    }
    catch(err) {
        res.status(404).json({message: err.message});
    }
}

// UPDATE //

export const likePost = async (req, res) => {

    try {

        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); // checking if the the post has been liked by the user or not


        if(isLiked) {
            post.likes.delete(userId); // if the post is liked by the userId, then delete the like of that user if he/she again clicks on the like button
        }
        else {
            post.likes.set(userId, true); // if it is their first time clicking on the like button then set the like by their id
        }

        // here we are actually updating those likes or dislikes on the post when someone clicks
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost); // here we have send the updated version of post to the frontend, so that we get to see the likes
         
    }
    catch(err) {
        res.status(404).json({ message: err.message });
    }
}