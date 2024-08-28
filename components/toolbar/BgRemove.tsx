"use client";

import { Button } from "../ui/button";
import { Image } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { useState } from "react";
import { bgRemove } from "@/server/bg-remove";

const BgRemove = () => {
	const setGenerating = useImageStore((state) => state.setGenerating);
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const addLayer = useLayerStore((state) => state.addLayer);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const [activeTag, setActiveTag] = useState("");
	const generating = useImageStore((state) => state.generating);

	return (
		<Popover>
			<PopoverTrigger disabled={!activeLayer?.url} asChild>
				<Button variant="outline" className="py-8">
					<span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
						BG Removal
						<Image size={18} />
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Background Removal</h4>
						<p className="text-sm max-w-xs text-muted-foreground">
							Remove the background of an image with one simple click.
						</p>
					</div>
				</div>
				<Button
					disabled={!activeLayer?.url || generating}
					className="w-full mt-4"
					onClick={async () => {
						setGenerating(true);
						const newLayerId = crypto.randomUUID();
						const res = await bgRemove({
							activeImage: activeLayer.url || "",
							format: activeLayer.format || "png",
						});

						if (res?.data?.success) {
							const newLayerId = crypto.randomUUID();
							addLayer({
								id: newLayerId,
								name: `bg-removed${activeLayer.name}`,
								format: "png",
								height: activeLayer.height,
								width: activeLayer.width,
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
					{generating ? "Removing..." : "Remove Background"}
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default BgRemove;
