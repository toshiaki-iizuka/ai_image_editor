"use client";

import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { Layers2 } from "lucide-react";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";

const LayerPanel = () => {
	const layers = useLayerStore((state) => state.layers);
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const generating = useImageStore((state) => state.generating);

	return (
		<Card
			className="basis-[320px] shrink-0 scrollbar-thin scrollbar-track-secondary
      overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full
      scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl"
		>
			<CardHeader className="">
				<div>
					<CardTitle className="text-sm">
						{activeLayer.name || "Layers"}
					</CardTitle>
					{activeLayer.width && activeLayer.height ? (
						<CardDescription className="text-xs">
							{activeLayer.width}x{activeLayer.height}
						</CardDescription>
					) : null}
				</div>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col">
				{layers.map((layer, index) => (
					<div
						className={cn(
							"cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
							{ "animate-pulse": generating },
						)}
						key={layer.id}
					>
						<div className="relative p-4 flex items-center">
							<div className="flex gap-2 items-center h-8 w-full justify-between">
								{!layer.url ? (
									<p className="text-xs font-medium justify-self-end">
										New Layer
									</p>
								) : null}
							</div>
						</div>
					</div>
				))}
			</CardContent>
			<div className="sticky bottom-0 bg-card flex gap-2 shrink-0">
				<Button className="w-full flex gap-2" variant="outline">
					<span className="text-xs">Create Layer</span>
					<Layers2 className="text-secondary-foreground" size={18} />
				</Button>
			</div>
		</Card>
	);
};

export default LayerPanel;
