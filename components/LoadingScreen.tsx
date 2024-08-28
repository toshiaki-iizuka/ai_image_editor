"use client";

import loadingAnimation from "@/public/animations/loading.json";
import Lottie from "lottie-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";

const Loading = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);
	const generating = useImageStore((state) => state.generating);

	const setGenerating = useImageStore((state) => state.setGenerating);

	return (
		<Dialog open={generating} onOpenChange={setGenerating}>
			<DialogContent className="sm:max-w-[420px] flex flex-col items-center">
				<DialogHeader>
					<DialogTitle>Editing {activeLayer.name}</DialogTitle>
					<DialogDescription>
						Please note that this operation might take up to a couple of
						seconds.
					</DialogDescription>
				</DialogHeader>
				<Lottie className="w-36" animationData={loadingAnimation} />
			</DialogContent>
		</Dialog>
	);
};

export default Loading;
