"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Ellipsis, Trash } from "lucide-react";
import { type Layer, useLayerStore } from "@/lib/layer-store";

const LayerInfo = ({
	layer,
	layerIndex,
}: {
	layer: Layer;
	layerIndex: number;
}) => {
	const layers = useLayerStore((state) => state.layers);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const removeLayer = useLayerStore((state) => state.removeLayer);

	return (
		<Dialog>
			<DialogTitle>
				<DialogTrigger asChild>
					<Button variant="outline">
						<Ellipsis size={18} />
					</Button>
				</DialogTrigger>
			</DialogTitle>
			<DialogContent className="text-xs">
				<h3 className="text-lg font-medium text-center mb-2">
					Layer {layer.id}
				</h3>
				<div className="py-4 space-y-0.5">
					<p>
						<span className="font-bold">Filename:</span> {layer.name}
					</p>
					<p>
						<span className="font-bold">Format:</span> {layer.format}
					</p>
					<p>
						<span className="font-bold">Size:</span> {layer.width}x
						{layer.height}
					</p>
				</div>
				<Button
					className="flex items-center gap-2 w-full"
					onClick={(e) => {
						e.stopPropagation();
						setActiveLayer(layerIndex === 0 ? layers[1].id : layers[0].id);
						removeLayer(layer.id);
					}}
				>
					<span>Delete Layer</span>
					<Trash size={14} />
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default LayerInfo;
