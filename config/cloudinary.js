const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
// https://github.com/expressjs/multer
const multer = require("multer"); // convertit les fichiers uploadés et le met à disposition dans req.file

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "user-pictures",
  // ci-dessous, si besoin d'uploader de la video ...
  /*
    params: { resource_type: "raw" }
    */
});

// Cloudinary : Uploader .upload ( " my_file_name.docx " ,
//    : public_id => " sample_document.docx " ,
//    resource_type => ' brute ' , 
//    : raw_convert => ' Aspose ' )

const fileUploader = multer({ storage });

module.exports = fileUploader;
