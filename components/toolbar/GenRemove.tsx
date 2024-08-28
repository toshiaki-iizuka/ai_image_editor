"use client";

import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { useState } from "react";

import { genRemove } from "@/server/gen-remove";

const GenRemove = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);

	const addLayer = useLayerStore((state) => state.addLayer);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const setGenerating = useImageStore((state) => state.setGenerating);

	const [activeTag, setActiveTag] = useState("");

	return (
		<Popover>
			<PopoverTrigger disabled={!activeLayer?.url} asChild>
				<Button variant="outline" className="p-8">
					<span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
						Content Aware <Eraser size={20} />
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Smart AI Remove</h4>
						<p className="text-sm text-muted-foreground">
							Generative Remove any part of the image
						</p>
					</div>
					<div className="grid grid-cols-3 items-center gap-4">
						<Label htmlFor="selection">Selection</Label>
						<Input
							className="col-span-2 h-8"
							value={activeTag}
							onChange={(e) => {
								setActiveTag(e.target.value);
							}}
						/>
					</div>
				</div>
				<Button
					className="w-full mt-4"
					onClick={async () => {
						const newLayerId = crypto.randomUUID();
						setGenerating(true);
						const res = await genRemove({
							activeImage: activeLayer.url || "",
							prompt: activeTag,
						});

						if (res?.data?.success) {
							setGenerating(false);

							addLayer({
								id: newLayerId,
								url: res.data.success,
								format: activeLayer.format,
								height: activeLayer.height,
								width: activeLayer.width,
								name: `gen-removed-${activeLayer.name}`,
								publicId: activeLayer.publicId,
								resourceType: "image",
							});
							setActiveLayer(newLayerId);
						}
					}}
				>
					Magic Remove
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default GenRemove;
