import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

async function uploadFile(data, folder) {
  try {
    return await cloudinary.uploader.upload(data, { folder })?.secure_url;
  } catch (err) {
    console.log(err);
    return err.message;
  }
}

async function deleteFile(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export const POST = async (req) => {
  try {
    const { file, folder } = req.json();
    const fileURL = await uploadFile(file, folder);
    return NextResponse.json({ fileURL }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export const DELETE = async (req) => {
  try {
    const { publicId } = req.json();
    const deleted = await deleteFile(publicId);
    if (deleted) {
      return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Error deleting file" }, { status: 500 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}