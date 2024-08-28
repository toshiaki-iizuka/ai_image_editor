"use client";

import UploadImage from "./UploadImage";
import UploadVideo from "./UploadVideo";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ImageIcon, VideoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLayerStore } from "@/lib/layer-store";
import { useState } from "react";

const UploadForm = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const layerComparisonMode = useLayerStore(
		(state) => state.layerComparisonMode,
	);
	const [selectedType, setSelectedType] = useState("image");

	if (!activeLayer.url && !layerComparisonMode)
		return (
			<div className="w-full p-24 flex flex-col  justify-center  h-full">
				{selectedType === "image" ? <UploadImage /> : null}
				{selectedType === "video" ? <UploadVideo /> : null}

				<RadioGroup
					defaultValue="image"
					onValueChange={(e) => {
						setSelectedType(e);
					}}
					className="flex items-center justify-center gap-8 py-8"
				>
					<Card
						onClick={(e) => setSelectedType("image")}
						className={cn(
							"flex flex-col items-center justify-center py-4 px-6 gap-4 cursor-pointer",
							selectedType === "image" ? "border-primary" : null,
						)}
					>
						<CardContent className="flex items-center space-x-2 p-0">
							<RadioGroupItem value="image" id="image-mode" hidden />
							<Label
								className={`${
									selectedType === "image" ? "text-primary" : null
								}`}
								htmlFor="image-mode"
							>
								Image Mode
							</Label>
						</CardContent>
						<ImageIcon
							className={`${selectedType === "image" ? "text-primary" : null}`}
							size={36}
						/>
					</Card>
					<Card
						onClick={(e) => setSelectedType("video")}
						className={cn(
							"flex flex-col items-center justify-center p-4 gap-4 cursor-pointer",
							selectedType === "video" ? "border-primary" : null,
						)}
					>
						<CardContent className="flex items-center  space-x-2 p-0">
							<RadioGroupItem value="video" id="video-mode" hidden />
							<Label
								className={`${
									selectedType === "video" ? "text-primary" : null
								}`}
								htmlFor="video-mode"
							>
								Video Mode
							</Label>
						</CardContent>
						<VideoIcon
							className={`${selectedType === "video" ? "text-primary" : null}`}
							size={36}
						/>
					</Card>
				</RadioGroup>
			</div>
		);
};

export default UploadForm;
