import express from 'express'
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer'
import mkdirp from 'mkdirp';
import path from 'path';


const UPLOAD_DIR = 'uploads';

// Ensure the upload directory exists
mkdirp.sync(UPLOAD_DIR);


const foodRouter = express.Router();

// Image Storage Engine
// const storage = multer.diskStorage({
//     destination: "uploads",
//     filename: (req, file, cb)=>{
//         return cb(null, `${Date.now()}${file.originalname}`)
//     }
// })


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR); // Use the writable /tmp directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ storage: storage });

// const upload = multer({storage:storage})

foodRouter.post("/add", upload.single("image"), addFood, (req, res) => {
    res.send('File uploaded successfully.');
})
foodRouter.get("/list", listFood)
foodRouter.post("/remove", removeFood)




export default foodRouter;