"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { useLayerStore } from "@/lib/layer-store";
import { useState } from "react";

const ExportAsset = ({ resource }: { resource?: string }) => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const [selected, setSelected] = useState("original");

	const handleDownload = async () => {
		if (activeLayer?.publicId) {
			try {
				const res = await fetch(
					`/api/download?publicId=${activeLayer.publicId}&quality=${selected}&resource_type=${activeLayer.resourceType}&format=${activeLayer.format}&url=${activeLayer.url}`,
				);
				if (!res.ok)
					throw new Error(`Failed to fetch image URL: ${res.statusText}`);

				const data = await res.json();
				if (data.error) throw new Error(`API error: ${data.error}`);

				const imageResponse = await fetch(data.url);
				if (!imageResponse.ok)
					throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);

				const imageBlob = await imageResponse.blob();

				const downloadUrl = URL.createObjectURL(imageBlob);
				const link = document.createElement("a");
				link.href = downloadUrl;
				link.download = data.filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				URL.revokeObjectURL(downloadUrl);
			} catch (error) {
				console.error("Download failed:", error);
			}
		}
	};

	return (
		<Dialog>
			<DialogTrigger disabled={!activeLayer?.url} asChild>
				<Button variant="outline" className="py-8">
					<span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
						Export
						<Download size={18} />
					</span>
				</Button>
			</DialogTrigger>
			<DialogTitle />
			<DialogContent>
				<DialogDescription />
				<div>
					<h3
						id="dialog-title"
						className="text-center text-2xl font-medium pb-4"
					>
						Export
					</h3>
					<div className="flex flex-col gap-4">
						<Card
							onClick={() => setSelected("original")}
							className={cn(
								selected === "original" ? "border-primary" : null,
								"p-4 cursor-pointer",
							)}
						>
							<CardContent className="p-0">
								<CardTitle className="text-md">Original</CardTitle>
								<CardDescription>
									{activeLayer.width}X{activeLayer.height}
								</CardDescription>
							</CardContent>
						</Card>
						<Card
							onClick={() => setSelected("large")}
							className={cn(
								selected === "large" ? "border-primary" : null,
								"p-4 cursor-pointer",
							)}
						>
							<CardContent className="p-0">
								<CardTitle className="text-md">Large</CardTitle>
								<CardDescription>
									{((activeLayer.width || 0) * 0.7).toFixed(0)}x
									{((activeLayer.height || 0) * 0.7).toFixed(0)}
								</CardDescription>
							</CardContent>
						</Card>
						<Card
							onClick={() => setSelected("medium")}
							className={cn(
								selected === "medium" ? "border-primary" : null,
								"p-4 cursor-pointer",
							)}
						>
							<CardContent className="p-0">
								<CardTitle className="text-md">Medium</CardTitle>
								<CardDescription>
									{(activeLayer.width || 0).toFixed(0)}x
									{((activeLayer.height || 0) * 0.5).toFixed(0)}
								</CardDescription>
							</CardContent>
						</Card>
						<Card
							className={cn(
								selected === "small" ? "border-primary" : null,
								"p-4 cursor-pointer",
							)}
							onClick={() => setSelected("small")}
						>
							<CardContent className="p-0">
								<CardTitle className="text-md">Small</CardTitle>
								<CardDescription>
									{((activeLayer.width || 0) * 0.3).toFixed(0)}x
									{((activeLayer.height || 0) * 0.3).toFixed(0)}
								</CardDescription>
							</CardContent>
						</Card>
					</div>
				</div>
				<Button onClick={handleDownload}>
					Download {selected} {resource}
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default ExportAsset;
