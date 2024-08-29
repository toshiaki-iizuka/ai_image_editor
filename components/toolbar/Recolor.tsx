"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paintbrush } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useLayerStore } from "@/lib/layer-store";
import { useImageStore } from "@/lib/image-store";

import { recolorImage } from "@/server/recolor";

const AIRecolor = () => {
	const activeColor = useImageStore((state) => state.activeColor);
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const activeTag = useImageStore((state) => state.activeTag);
	const generating = useImageStore((state) => state.generating);
	const tags = useImageStore((state) => state.tags);
	const addLayer = useLayerStore((state) => state.addLayer);
	const setActiveColor = useImageStore((state) => state.setActiveColor);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const setActiveTag = useImageStore((state) => state.setActiveTag);
	const setGenerating = useImageStore((state) => state.setGenerating);

	return (
		<Popover>
			<PopoverTrigger disabled={!activeLayer?.url} asChild>
				<Button variant="outline" className="py-8">
					<span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
						AI Recolor
						<Paintbrush size={18} />
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Generative Recolor</h4>
						<p className="text-sm text-muted-foreground">
							Recolor any part of your image with generative recolor.
						</p>
					</div>
					<div className="grid gap-2">
						<h3 className="text-xs">Suggested selections</h3>
						<div className="flex gap-2">
							{tags.length === 0 && (
								<p className="text-xs text-muted-foreground">
									No tags available
								</p>
							)}
							{tags.map((tag) => (
								<Badge
									key={tag}
									onClick={() => setActiveTag(tag)}
									className={cn(
										"px-2 py-1 rounded text-xs",
										activeTag === tag && "bg-primary text-white",
									)}
								>
									{tag}
								</Badge>
							))}
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="width">Selection</Label>
							<Input
								className="col-span-2 h-8"
								value={activeTag}
								name="tag"
								onChange={(e) => {
									setActiveTag(e.target.value);
								}}
							/>
						</div>
						<h3 className="text-xs">Suggested colors</h3>
						<div className="flex gap-2">
							<div
								className="w-4 h-4 bg-blue-500 rounded-sm cursor-pointer"
								onKeyDown={() => setActiveColor("blue")}
							/>
							<div
								className="w-4 h-4 bg-red-500 rounded-sm cursor-pointer"
								onKeyDown={() => setActiveColor("red")}
							/>
							<div
								className="w-4 h-4 bg-green-500 rounded-sm cursor-pointer"
								onKeyDown={() => setActiveColor("green")}
							/>
							<div
								className="w-4 h-4 bg-yellow-500 rounded-sm cursor-pointer"
								onKeyDown={() => setActiveColor("yellow")}
							/>
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="maxWidth">Color</Label>
							<Input
								name="color"
								value={activeColor}
								onChange={(e) => setActiveColor(e.target.value)}
								className="col-span-2 h-8"
							/>
						</div>
					</div>
				</div>
				<Button
					disabled={
						!activeLayer?.url || !activeTag || !activeColor || generating
					}
					className="w-full mt-4"
					onClick={async () => {
						setGenerating(true);
						const res = await recolorImage({
							color: `to-color_${activeColor}`,
							activeImage: activeLayer.url || "",
							tag: `prompt_${activeTag}`,
						});

						if (res?.data?.success) {
							const newLayerId = crypto.randomUUID();
							addLayer({
								id: newLayerId,
								name: `recolored${activeLayer.name}`,
								format: activeLayer.format,
								height: activeLayer.height,
								width: activeLayer.width,
								url: res.data.success,
								publicId: activeLayer.publicId,
								resourceType: "image",
							});
							setGenerating(false);
							setActiveLayer(newLayerId);
						}
					}}
				>
					{generating ? "Generating..." : "Recolor"}
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default AIRecolor;
