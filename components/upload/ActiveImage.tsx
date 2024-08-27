import Image from "next/image";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/image-store";
import { type Layer, useLayerStore } from "@/lib/layer-store";

const ActiveImage = () => {
	const generating = useImageStore((state) => state.generating);
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const layers = useLayerStore((state) => state.layers);

	if (!activeLayer.url) return null;

	const renderLayer = (layer: Layer) => (
		<div className="relative w-full h-full flex items-center justify-center">
			{layer.resourceType === "image" && (
				<Image
					alt={layer.name || "Image"}
					src={layer.url || ""}
					fill={true}
					className={cn(
						"rounded-lg object-contain",
						generating ? "animate-pulse" : "",
					)}
					priority
				/>
			)}
			{layer.resourceType === "video" && (
				<video
					width={layer.width}
					height={layer.height}
					controls
					className="rounded-lg object-contain max-w-full max-h-full"
				>
					<track
						src={layer.transcriptionURL || layer.url}
						default
						kind="captions"
					/>
				</video>
			)}
		</div>
	);

	return (
		<div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
			{renderLayer(activeLayer)}
		</div>
	);
};

export default ActiveImage;
