// import AWS from 'aws-sdk';
// import { v4 as uuidv4 } from 'uuid';
// import path from 'path';

// const s3 = new AWS.S3({
//     region: process.env.AWS_REGION,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

export const uploadToS3 = async (file: Buffer, fileName: string) => {
    console.log(`${file}- ${fileName}`)
    return "https://i.pravatar.cc/300"; // Devuelve la URL de la imagen
};


export const saveBannerContent = async () => {
    return 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3'
}