"use client";

import { Button } from "@/components/ui/button";
import { Captions } from "lucide-react";
import { initiateTranscription } from "@/server/transcription";
import { toast } from "sonner";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { useState } from "react";

const Transcription = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const setGenerating = useImageStore((state) => state.setGenerating);
	const updateLayer = useLayerStore((state) => state.updateLayer);
	const [transcribing, setTranscribing] = useState(false);

	const handleTranscribe = async () => {
		if (!activeLayer.publicId || activeLayer.resourceType !== "video") {
			toast.error("Please select a video layer first");
			return;
		}

		setTranscribing(true);
		setGenerating(true);

		try {
			const result = await initiateTranscription({
				publicId: activeLayer.publicId,
			});

			if (result) {
				if (result.data && "success" in result.data) {
					toast.success(result.data.success);

					if (result.data.subtitledVideoUrl) {
						updateLayer({
							...activeLayer,
							transcriptionURL: result.data.subtitledVideoUrl,
						});
						setActiveLayer(activeLayer.id);
					}
				} else if (result.data && "error" in result.data) {
					toast.error(result.data.error);
				} else {
					toast.error("Unexpected response from server");
				}
			}
		} catch (error) {
			toast.error("An error occurred during transcription");
		} finally {
			setTranscribing(false);
			setGenerating(false);
		}
	};

	return (
		<div className="flex items-center">
			{!activeLayer.transcriptionURL && (
				<Button
					className="py-8 w-full"
					onClick={handleTranscribe}
					disabled={transcribing || activeLayer.resourceType !== "video"}
					variant={"outline"}
				>
					<span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
						{transcribing ? "Transcribing..." : "Transcribe"}
						<Captions size={18} />
					</span>
				</Button>
			)}

			{activeLayer.transcriptionURL && (
				<Button className="py-8 w-full" variant={"outline"} asChild>
					<a
						href={activeLayer.transcriptionURL}
						target="_blank"
						rel="noopener noreferrer"
					>
						<span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
							View Transcription
							<Captions size={18} />
						</span>
					</a>
				</Button>
			)}
		</div>
	);
};

export default Transcription;
