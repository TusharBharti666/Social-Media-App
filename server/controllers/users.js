import User from "../models/User.js"; // import the users data from the database


// READ //

export const getUser = async (req, res) => {

    try {

        const { id } = req.params; // grabbing the id from the request parameters
        const user = await User.findById(id);  // checking if the user with the id exist or not
        res.status(200).json(user); // sending back all the user's info to the frontend
    }
    catch(err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {

    try {
        const { id } = req.params; 
        const user = await User.findById(id); 

        // grabbing user's all friends one by one that's why promise.all() is used because we are making multiple api calls
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // we have formatted the user's friends information properly before sending it to the frontend
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => { // grab them
                return { _id, firstName, lastName, occupation, location, picturePath }; // return them
            }
        );
        res.status(200).json(formattedFriends);
    }
    catch(err) {
        res.status(404).json({message: err.message });
    }
};

// UPDATE //

export const addRemoveFriend = async (req, res) => {

    try {

        // grabbing the user's id and their friend id whom we want to delete and then finding the data of both of them
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);


        // if user's friends exist then remove them from the user's list and also remove the user from their friend's list
        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        }
        else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        // save the changes for both the users (logged in one and their friend)
        await user.save();
        await friend.save();

        // we again format the friend list because we made changes in it
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // we have formatted the user's friends information properly before sending it to the frontend
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => { // grab them
                return { _id, firstName, lastName, occupation, location, picturePath }; // return them
            }
        );
        res.status(200).json(formattedFriends);
    }
    catch(err) {
        res.status(404).json({message: err.message });
    }
};