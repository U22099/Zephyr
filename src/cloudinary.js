import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function uploadFile(data, folder){
  try{
    return await cloudinary.uploader.upload(data, {
      folder
    })?.secure_url
  } catch(err) {
    console.log(err);
    return err.message;
  }
}