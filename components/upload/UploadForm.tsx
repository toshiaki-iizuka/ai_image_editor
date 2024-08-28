"use client";

import UploadImage from "./UploadImage";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/lib/layer-store";
import { useState } from "react";

const UploadForm = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const [selectedType, setSelectedType] = useState("image");

	if (!activeLayer.url)
		return (
			<div className="w-full p-24 flex flex-col  justify-center  h-full">
				{selectedType === "image" ? <UploadImage /> : null}
			</div>
		);
};

export default UploadForm;
