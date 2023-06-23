import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(

    {

        firstName: {
            type: String,
            required: true,
            min: 3,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 3,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            min: 3,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 3,
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,

        
    },
    {timestamps: true}  /*this will give us automatic dates like when its created , updated,etc */ 
);

const User = mongoose.model("User", UserSchema); // to work on the data we need to convert the schema into data model
export default User;  // to use this model somewher else, we need to export it