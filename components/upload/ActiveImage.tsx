import Image from "next/image";
import ImageComparison from "@/components/layer/ImageComparison";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/image-store";
import { type Layer, useLayerStore } from "@/lib/layer-store";

const ActiveImage = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const comparedLayers = useLayerStore((state) => state.comparedLayers);
	const generating = useImageStore((state) => state.generating);
	const layers = useLayerStore((state) => state.layers);
	const layerComparisonMode = useLayerStore(
		(state) => state.layerComparisonMode,
	);

	if (!activeLayer.url && comparedLayers.length === 0) return null;

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
					src={layer.transcriptionURL || layer.url}
				>
					<track default kind="captions" />
				</video>
			)}
		</div>
	);

	if (layerComparisonMode && comparedLayers.length > 0) {
		const comparisonLayers = comparedLayers
			.map((id) => layers.find((l) => l.id === id))
			.filter(Boolean) as Layer[];

		return (
			<div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
				<ImageComparison layers={comparisonLayers} />
			</div>
		);
	}

	return (
		<div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
			{renderLayer(activeLayer)}
		</div>
	);
};

export default ActiveImage;
