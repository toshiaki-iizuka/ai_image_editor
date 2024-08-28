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

const bgReplaceSchema = z.object({
	activeImage: z.string(),
	prompt: z.string(),
});

export const bgReplace = actionClient
	.schema(bgReplaceSchema)
	.action(async ({ parsedInput: { activeImage, prompt } }) => {
		const parts = activeImage.split("/upload/");
		const replaceUrl = prompt
			? `${
					parts[0]
				}/upload/e_gen_background_replace:prompt_${encodeURIComponent(
					prompt,
				)}/${parts[1]}`
			: `${parts[0]}/upload/e_gen_background_replace/${parts[1]}`;

		let isProcessed = false;
		const maxAttempts = 20;
		const delay = 1000;
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			isProcessed = await checkImageProcessing(replaceUrl);
			if (isProcessed) break;

			await new Promise((resolve) => setTimeout(resolve, delay));
		}
		if (!isProcessed) throw new Error("Image processing timed out");

		return { success: replaceUrl };
	});
