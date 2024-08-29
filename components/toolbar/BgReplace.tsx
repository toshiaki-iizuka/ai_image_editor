"use client";

import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";
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

import { bgReplace } from "@/server/bg-replace";

const BgReplace = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const generating = useImageStore((state) => state.generating);
	const addLayer = useLayerStore((state) => state.addLayer);
	const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
	const setGenerating = useImageStore((state) => state.setGenerating);
	const [prompt, setPrompt] = useState("");

	return (
		<Popover>
			<PopoverTrigger disabled={!activeLayer?.url} asChild>
				<Button variant="outline" className="py-8">
					<span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
						BG Replace
						<ImageOff size={18} />
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">
							Generative Background Replace
						</h4>
						<p className="text-sm max-w-xs text-muted-foreground">
							Replace the background of your image with AI-generated content.
						</p>
					</div>
					<div className="grid gap-2">
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="prompt">Prompt (optional)</Label>
							<Input
								id="prompt"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								placeholder="Describe the new background"
								className="col-span-2 h-8"
							/>
						</div>
					</div>
				</div>
				<Button
					disabled={!activeLayer?.url || generating}
					className="w-full mt-4"
					onClick={async () => {
						setGenerating(true);
						const newLayerId = crypto.randomUUID();
						const res = await bgReplace({
							activeImage: activeLayer.url || "",
							prompt: prompt,
						});

						if (res?.data?.success) {
							const newLayerId = crypto.randomUUID();
							addLayer({
								id: newLayerId,
								name: `bg-replaced-${activeLayer.name}`,
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
						if (res?.serverError) {
							setGenerating(false);
						}
					}}
				>
					{generating ? "Generating..." : "Replace Background"}
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default BgReplace;
