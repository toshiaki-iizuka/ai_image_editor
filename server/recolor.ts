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

const recolorSchema = z.object({
	tag: z.string(),
	color: z.string(),
	activeImage: z.string(),
});

export const recolorImage = actionClient
	.schema(recolorSchema)
	.action(async ({ parsedInput: { tag, color, activeImage } }) => {
		const parts = activeImage.split("/upload/");
		const recolorUrl = `${parts[0]}/upload/e_gen_recolor:${tag};${color}/${parts[1]}`;

		let isProcessed = false;
		const maxAttempts = 20;
		const delay = 1000;
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			isProcessed = await checkImageProcessing(recolorUrl);
			if (isProcessed) break;

			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		if (!isProcessed) throw new Error("Image processing timed out");

		return { success: recolorUrl };
	});
