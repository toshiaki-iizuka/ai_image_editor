"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/server/upload-image";
import { useDropzone } from "react-dropzone";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";

const UploadImage = () => {
	const setGenerating = useImageStore((state) => state.setGenerating);
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const updateLayer = useLayerStore((state) => state.updateLayer);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

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
				setGenerating(true);

				updateLayer({
					id: activeLayer.id,
					url: objectUrl,
					width: 0,
					height: 0,
					name: "uploading",
					publicId: "",
					format: "",
					resourceType: "image",
				});
				setActiveLayer(activeLayer.id);
				// STATE MANAGEMENT STUFF TO CREATE LAYERS, SET THE ACTIVE LAYER, AND SET THE IMAGE AS THE ACTIVE LAYER
				const res = await uploadImage({ image: formData });
				console.log(res);
				if (res?.data?.success) {
					updateLayer({
						id: activeLayer.id,
						url: res.data.success.url,
						width: res.data.success.width,
						height: res.data.success.height,
						name: res.data.success.original_filename,
						publicId: res.data.success.public_id,
						format: res.data.success.format,
						resourceType: res.data.success.resource_type,
					});

					setActiveLayer(activeLayer.id);
					setGenerating(false);
				}
				if (res?.data?.error) setGenerating(false);
			}
		},
	});

	if (!activeLayer.url)
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
