"use server";

import { type UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { actionClient } from "@/lib/safe-action";
import z from "zod";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formData = z.object({
	image: z.instanceof(FormData),
});

type UploadResult =
	| { success: UploadApiResponse; error?: never }
	| { error: string; success?: never };

export const uploadImage = actionClient
	.schema(formData)
	.action(async ({ parsedInput: { image } }) => {
		const formImage = image.get("image");
		if (!image) return { error: "No image provided" };
		if (!formImage) return { error: "No image was provided" };

		const file = formImage as File;

		try {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			return new Promise<UploadResult>((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{
						upload_preset: process.env.CLOUDINARY_NAME,
					},
					(error, result) => {
						if (error || !result) {
							reject({ error: "Upload failed" });
						} else {
							resolve({ success: result });
						}
					},
				);

				uploadStream.end(buffer);
			});
		} catch (error) {
			return { error: error };
		}
	});
