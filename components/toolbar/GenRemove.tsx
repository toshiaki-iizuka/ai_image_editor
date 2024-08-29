"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

import { genRemove } from "@/server/gen-remove";

const GenRemove = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const activeTag = useImageStore((state) => state.activeTag);
	const generating = useImageStore((state) => state.generating);
	const tags = useImageStore((state) => state.tags);
	const addLayer = useLayerStore((state) => state.addLayer);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const setActiveTag = useImageStore((state) => state.setActiveTag);
	const setGenerating = useImageStore((state) => state.setGenerating);

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
				</div>

				<Button
					className="w-full mt-4"
					disabled={!activeTag || !activeLayer.url || generating}
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
