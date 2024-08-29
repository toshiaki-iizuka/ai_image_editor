"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crop } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { useMemo, useState } from "react";

import { genFill } from "@/server/gen-fill";

const PREVIEW_SIZE = 300;
const EXPANSION_THRESHOLD = 250;

const GenFill = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const generating = useImageStore((state) => state.generating);
	const addLayer = useLayerStore((state) => state.addLayer);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const setGenerating = useImageStore((state) => state.setGenerating);
	const [height, setHeight] = useState(0);
	const [width, setWidth] = useState(0);

	const previewStyle = useMemo(() => {
		if (!activeLayer.width || !activeLayer.height) return {};

		const newWidth = activeLayer.width + width;
		const newHeight = activeLayer.height + height;

		const scale = Math.min(PREVIEW_SIZE / newWidth, PREVIEW_SIZE / newHeight);

		return {
			width: `${newWidth * scale}px`,
			height: `${newHeight * scale}px`,
			backgroundImage: `url(${activeLayer.url})`,
			backgroundSize: `${activeLayer.width * scale}px ${
				activeLayer.height * scale
			}px`,
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
			position: "relative" as const,
		};
	}, [activeLayer, width, height]);

	const previewOverlayStyle = useMemo(() => {
		if (!activeLayer.width || !activeLayer.height) return {};

		const scale = Math.min(
			PREVIEW_SIZE / (activeLayer.width + width),
			PREVIEW_SIZE / (activeLayer.height + height),
		);

		const leftWidth = width > 0 ? `${(width / 2) * scale}px` : "0";
		const rightWidth = width > 0 ? `${(width / 2) * scale}px` : "0";
		const topHeight = height > 0 ? `${(height / 2) * scale}px` : "0";
		const bottomHeight = height > 0 ? `${(height / 2) * scale}px` : "0";

		return {
			position: "absolute" as const,
			top: "0",
			left: "0",
			right: "0",
			bottom: "0",
			boxShadow: `inset ${leftWidth} ${topHeight} 0 rgba(48, 119, 255, 1),
                  inset -${rightWidth} ${topHeight} 0 rgba(48, 119, 255, 1),
                  inset ${leftWidth} -${bottomHeight} 0 rgba(48, 119, 255, 1),
                  inset -${rightWidth} -${bottomHeight} 0 rgba(48, 119, 255,1)`,
		};
	}, [activeLayer, width, height]);

	const ExpansionIndicator = ({
		value,
		axis,
	}: {
		value: number;
		axis: "x" | "y";
	}) => {
		const isVisible = Math.abs(value) >= EXPANSION_THRESHOLD;
		const position =
			axis === "x"
				? {
						top: "50%",
						[value > 0 ? "right" : "left"]: 0,
						transform: "translateY(-50%)",
					}
				: {
						left: "50%",
						[value > 0 ? "bottom" : "top"]: 0,
						transform: "translateX(-50%)",
					};

		return (
			<AnimatePresence>
				{isVisible} && (
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.5 }}
					className="absolute bg-primary text-white px-2 py-1 rounded-md text-xs font-bold"
					style={position}
				>
					{Math.abs(value)}px
				</motion.div>
				)
			</AnimatePresence>
		);
	};

	return (
		<Popover>
			<PopoverTrigger disabled={!activeLayer?.url} asChild>
				<Button variant="outline" className="py-8">
					<span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
						Generative Fill
						<Crop size={18} />
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full">
				<div className="flex flex-col h-full">
					<div className="space-y-2">
						<h4 className="font-medium text-center py-2 leading-none">
							Generative Fill
						</h4>
						{activeLayer.width && activeLayer.height ? (
							<div className="flex justify-evenly">
								<div className="flex flex-col items-center">
									<span className="text-xs">Current Size:</span>
									<p className="text-sm text-primary font-bold">
										{activeLayer.width}x{activeLayer.height}
									</p>
								</div>
								<div className="flex flex-col items-center">
									<span className="text-xs">New Size:</span>
									<p className="text-sm text-primary font-bold">
										{activeLayer.width + width}x{activeLayer.height + height}
									</p>
								</div>
							</div>
						) : null}
					</div>
					<div className="flex gap-2 items-center justify-center">
						<div className="text-center">
							<Label htmlFor="maxWidth">Modify Width</Label>
							<Input
								name="width"
								type="range"
								max={activeLayer.width}
								value={width}
								onChange={(e) => setWidth(Number.parseInt(e.target.value))}
								className="h-8"
							/>
						</div>
						<div className="text-center">
							<Label htmlFor="maxHeight">Modify Height</Label>
							<Input
								name="height"
								type="range"
								min={
									activeLayer?.height
										? Math.max(-activeLayer.height + 100, 0)
										: 0
								}
								max={activeLayer?.height || 0}
								value={height}
								step={2}
								onChange={(e) => setHeight(Number.parseInt(e.target.value))}
								className="h-8"
							/>
						</div>
					</div>
					<div
						className="preview-container flex-grow flex justify-center items-center overflow-hidden m-auto"
						style={{
							width: `${PREVIEW_SIZE}px`,
							height: `${PREVIEW_SIZE}px`,
						}}
					>
						<div style={previewStyle}>
							<div className="animate-pulsate" style={previewOverlayStyle} />
							<ExpansionIndicator value={width} axis="x" />
							<ExpansionIndicator value={height} axis="y" />
						</div>
					</div>
					<Button
						disabled={!activeLayer?.url || generating}
						className="w-full mt-4"
						onClick={async () => {
							setGenerating(true);
							const newLayerId = crypto.randomUUID();
							const res = await genFill({
								width: width + (activeLayer.width || 0),
								height: height + (activeLayer.height || 0),
								aspect: "1:1",
								activeImage: activeLayer.url || "",
							});

							if (res?.data?.success) {
								const newLayerId = crypto.randomUUID();
								addLayer({
									id: newLayerId,
									name: `gen-fill-${activeLayer.name}`,
									format: activeLayer.format,
									height: height + (activeLayer.height || 0),
									width: width + (activeLayer.width || 0),
									url: res.data.success,
									publicId: activeLayer.publicId,
									resourceType: "image",
								});
								setGenerating(false);
								setActiveLayer(newLayerId);
							}
							if (res?.serverError) {
								setGenerating(false);
							}
						}}
					>
						{generating ? "Generating..." : "Generative Fill"}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default GenFill;
