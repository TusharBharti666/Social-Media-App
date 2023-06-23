import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"; 
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";
import { fileURLToPath } from "url";
import { verifyToken } from "./middleware/auth.js";
import { register } from "./controllers/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";


mongoose.set('strictQuery', true); // just to supress a warning 

/* CONFIGURATION FOR MIDDLEWARE */ /* MIDDLEWARE IS SOMETHING THAT RUNS BETWEEN DIFF THINGS*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // local storage this is where we store our pictures 


// FILE STORAGE // WHEN SOMEONE UPLOADS A FILE

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, "public/assets");  // we are uploading the picture in this folder public/assets when the user registers
    },
    filename: function(req,file,cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage }); // anytime we need to upload a file we will use this var

// AUTHENTICATION // ROUTES WITH FILES // here we are storing the data of the user when ther register first time
app.post("/auth/register", upload.single("picture"), register); // upload.single is the middleware that get hits before the register
app.post("/posts", verifyToken, upload.single("picture"), createPost); // createPost controller will grab the picture and upload it in the storage

// ROUTES //
app.use("/auth", authRoutes); // route for authorization and authentication
app.use("/users", userRoutes); // route for add, remove the user as well as reading the user's data
app.use("/posts", postRoutes); // route for posting the photos

// MONGOOSE SETUP //
const PORT = process.env.PORT || 6001  // incase the main port doesn't work, we have backup port 6001
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
.then(() => {         // after connecting with the Db we come inside this then or catch, 
                     //then will start the app at the port and after that return a callback 
                     // in which we print the message or if the error gets occur we went inside the catch block

    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // add all the users and posts only one time manually after that comment out this code, otherwise if we run the code twice, the data will get loaded twice
    // User.insertMany(users);
    // Post.insertMany(posts);

})
.catch((error) => console.log(`${error} did not connect`));
