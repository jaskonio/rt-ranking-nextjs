import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";


const s3Client = new S3Client({
    region: process.env.AWS_REGION, // Configura tu región AWS en las variables de entorno
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});


export async function uploadToS3(buffer: Buffer, fileName: string | undefined): Promise<string> {
    try {
        const bucketName = process.env.S3_BUCKET_NAME; // Define el nombre del bucket en variables de entorno
        const fileKey = fileName || `${uuidv4()}`; // Genera un nombre único para evitar colisiones

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: buffer,
            ContentType: "image/jpeg", // Establece el tipo de contenido adecuado
        });

        await s3Client.send(command);

        const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        return publicUrl;
    } catch (error) {
        console.error("Error al subir el archivo a S3:", error);
        throw new Error("Error uploading file to S3");
    }
}

export async function deleteFromS3(fileKey: string): Promise<void> {
    try {
        const bucketName = process.env.S3_BUCKET_NAME;
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });

        await s3Client.send(command);

        console.log(`Archivo eliminado: ${fileKey}`);
    } catch (error) {
        console.error("Error eliminando el archivo de S3:", error);
        throw new Error("No se pudo eliminar el archivo de S3.");
    }
}
