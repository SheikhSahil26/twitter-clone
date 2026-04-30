// import multer from "multer";
// import path from "path"





// const dirName = process.cwd();

// const storageConfig = multer.diskStorage({
// 	// destinations is uploads folder 
// 	// under the project directory
// 	destination: "uploads",
// 	filename: (req, file, res) => {
// 		// file name is prepended with current time
// 		// in milliseconds to handle duplicate file names
// 		res(null, Date.now() + "-" + file.originalname);
// 	},
// });

// // file filter for filtering only images
// // const fileFilterConfig = function(req, file, cb) {
// // 	if (file.mimetype === "image/jpeg"
// // 		|| file.mimetype === "image/png") {
// // 		// calling callback with true
// // 		// as mimetype of file is image
// // 		cb(null, true);
// // 	} else {
// // 		// false to indicate not to store the file
// // 		cb(null, false);
// // 	}
// // };

// // creating multer object for storing
// // with configuration
// export const upload = multer({
// 	// applying storage and file filter
// 	storage: storageConfig,
// 	limits: {
// 		// limits file size to 5 MB
// 		fileSize: 1024 * 1024 * 5
// 	},
// 	// fileFilter: fileFilterConfig,
// });

import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"public/uploads");
    },
    filename: (req,file,cb) => {
        const uniqueName = Date.now() + "-" + Math.random() + path.extname(file.originalname);
        cb(null,uniqueName)
    }
})

export const upload  = multer ({storage});