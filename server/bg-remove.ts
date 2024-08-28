"use server";

import { checkImageProcessing } from "@/lib/check-processing";
import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const bgRemoveSchema = z.object({
	activeImage: z.string(),
	format: z.string(),
});

export const bgRemove = actionClient
	.schema(bgRemoveSchema)
	.action(async ({ parsedInput: { activeImage, format } }) => {
		const form = activeImage.split(format);
		const pngConvert = `${form[0]}png`;
		const parts = activeImage.split("/upload/");
		const removeUrl = `${parts[0]}/upload/e_background_removal/${parts[1]}`;

		let isProcessed = false;
		const maxAttempts = 20;
		const delay = 1000;
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			isProcessed = await checkImageProcessing(removeUrl);
			if (isProcessed) break;

			await new Promise((resolve) => setTimeout(resolve, delay));
		}
		if (!isProcessed) throw new Error("Image processing timed out");

		return { success: removeUrl };
	});
