"use client";

import { useLayerStore } from "@/lib/layer-store";
import Transcription from "./Transcription";

const VideoTools = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	if (activeLayer.resourceType === "video")
		return (
			<>
				<Transcription />
			</>
		);
};

export default VideoTools;
