import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
const uploadOnCloudinary=async (filepath)=>{
    cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET
    })

    try {
        const uploadResult = await cloudinary.uploader.upload(filepath)
        fs.unlinkSync(filepath) // local se delete karne ke liye
        return uploadResult.secure_url
    } catch (error) {
        fs.unlinkSync(filepath)
        console.log(error)
    }

}

export default uploadOnCloudinary