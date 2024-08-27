"use client";

import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/server/upload-image";
import { useDropzone } from "react-dropzone";

const UploadImage = () => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		maxFiles: 1,
		accept: {
			"image/png": [".png"],
			"image/jpg": [".jpg"],
			"image/jpeg": [".jpeg"],
			"image/webp": [".webp"],
		},
		onDrop: async (acceptFiles, fileRejections) => {
			if (acceptFiles.length) {
				const formData = new FormData();
				formData.append("image", acceptFiles[0]);
				const objectUrl = URL.createObjectURL(acceptFiles[0]);
				// STATE MANAGEMENT STUFF TO CREATE LAYERS, SET THE ACTIVE LAYER, AND SET THE IMAGE AS THE ACTIVE LAYER
				const res = await uploadImage({ image: formData });
			}
		},
	});
	return (
		<Card
			{...getRootProps()}
			className={cn(
				" hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all ease-in-out",
				`${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`,
			)}
		>
			<CardContent className="flex flex-col h-full items-center justify-center px-2 py-24 text-xs">
				<input {...getInputProps()} />
				<div className="flex items-center flex-col justify-center gap-4">
					<p className="text-muted-foreground text-2xl">
						{isDragActive
							? "Drop your image here!"
							: "Start by uploading an image"}
					</p>
					<p className="text-muted-foreground">
						Supported Formats .png .jpeg .jpg .webp
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default UploadImage;
