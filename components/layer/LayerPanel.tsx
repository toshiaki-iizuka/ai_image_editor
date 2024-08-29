"use client";

import Image from "next/image";
import LayerImage from "./LayerImage";
import LayerInfo from "./LayerInfo";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Images, Layers2 } from "lucide-react";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { useMemo } from "react";

const LayerPanel = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const comparedLayers = useLayerStore((state) => state.comparedLayers);
	const generating = useImageStore((state) => state.generating);
	const layers = useLayerStore((state) => state.layers);
	const layerComparisonMode = useLayerStore(
		(state) => state.layerComparisonMode,
	);
	const MotionCard = useMemo(() => motion(Card), []);
	const MotionButton = useMemo(() => motion(Button), []);
	const visibleLayers = useMemo(
		() =>
			layerComparisonMode
				? layers.filter((layer) => layer.url && layer.resourceType === "image")
				: layers,
		[layerComparisonMode, layers],
	);

	const addLayer = useLayerStore((state) => state.addLayer);
	const getLayerName = useMemo(
		() => (id: string) => {
			const layer = layers.find((l) => l.id === id);
			return layer ? layer.url : "Nothing here";
		},
		[layers],
	);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const setComparedLayers = useLayerStore((state) => state.setComparedLayers);
	const setLayerComparisonMode = useLayerStore(
		(state) => state.setLayerComparisonMode,
	);
	const toggleComparedLayer = useLayerStore(
		(state) => state.toggleComparedLayer,
	);

	return (
		<MotionCard
			className="basis-[320px] shrink-0 scrollbar-thin scrollbar-track-secondary
      overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full
      scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl"
		>
			<CardHeader className="sticky top-0 z-50 px-4 py-6 min-h-28 bg-card shadow-sm">
				{layerComparisonMode ? (
					<div>
						<CardTitle className="text-sm pb-2">Comparing...</CardTitle>
						<CardDescription className="flex gap-2 items-center">
							<Image
								alt="compare"
								width={32}
								height={32}
								src={getLayerName(comparedLayers[0]) as string}
							/>
							{comparedLayers.length > 0 && <ArrowRight />}
							{comparedLayers.length > 1 ? (
								<Image
									alt="compare"
									width={32}
									height={32}
									src={getLayerName(comparedLayers[1]) as string}
								/>
							) : (
								"Nothing here"
							)}
						</CardDescription>
					</div>
				) : (
					<div className="flex flex-col gap-1">
						<CardTitle className="text-sm ">
							{activeLayer.name || "Layers"}
						</CardTitle>
						{activeLayer.width && activeLayer.height ? (
							<CardDescription className="text-xs">
								{activeLayer.width}X{activeLayer.height}
							</CardDescription>
						) : null}
					</div>
				)}
			</CardHeader>
			<motion.div className="flex-1 flex flex-col ">
				<AnimatePresence>
					{visibleLayers.map((layer, index) => {
						return (
							<motion.div
								animate={{ scale: 1, opacity: 1 }}
								initial={{ scale: 0, opacity: 0 }}
								exit={{ scale: 0, opacity: 0 }}
								layout
								className={cn(
									"cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
									{
										"border-primary": layerComparisonMode
											? comparedLayers.includes(layer.id)
											: activeLayer.id === layer.id,
										"animate-pulse": generating,
									},
								)}
								key={layer.id}
								onClick={() => {
									if (generating) return;
									if (layerComparisonMode) {
										toggleComparedLayer(layer.id);
									} else {
										setActiveLayer(layer.id);
									}
								}}
							>
								<div className="relative p-4 flex items-center">
									<div className="flex gap-2 items-center h-8 w-full justify-between">
										{!layer.url ? (
											<p className="text-xs font-medium justify-self-end ">
												New layer
											</p>
										) : null}
										<LayerImage layer={layer} />
										{layers.length !== 1 && (
											<LayerInfo layer={layer} layerIndex={index} />
										)}
									</div>
								</div>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</motion.div>
			<CardContent className="flex-1 flex flex-col gap-2">
				<MotionButton
					layout
					onClick={() => {
						addLayer({
							id: crypto.randomUUID(),
							url: "",
							height: 0,
							width: 0,
							publicId: "",
							name: "",
							format: "",
						});
					}}
					variant="outline"
					className="w-full flex gap-2"
				>
					<span className="text-xs">Create Layer</span>
					<Layers2 className="text-secondary-foreground" size={18} />
				</MotionButton>
				<MotionButton
					disabled={!activeLayer.url || activeLayer.resourceType === "video"}
					layout
					onClick={() => {
						if (layerComparisonMode) {
							setLayerComparisonMode(!layerComparisonMode);
						} else {
							setComparedLayers([activeLayer.id]);
						}
					}}
					variant={layerComparisonMode ? "destructive" : "outline"}
					className="w-full flex gap-2"
				>
					<motion.span className={cn("text-xs font-bold")}>
						{layerComparisonMode ? "Stop Comparing" : "Compare"}
					</motion.span>
					{!layerComparisonMode && (
						<Images className="text-secondary-foreground" size={18} />
					)}
				</MotionButton>
			</CardContent>
		</MotionCard>
	);
};

export default LayerPanel;
