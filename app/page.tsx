"use client";

import Editor from "@/components/Editor";
import { ImageStore } from "@/lib/image-store";
import { LayerStore } from "@/lib/layer-store";

export default function Home() {
	return (
		<ImageStore.Provider
			initialValue={{
				activeTag: "all",
				generating: false,
			}}
		>
			<LayerStore.Provider
				initialValue={{
					layerComparisonMode: false,
					layers: [
						{
							id: crypto.randomUUID(),
							url: "",
							height: 0,
							width: 0,
							publicId: "",
						},
					],
				}}
			>
				<Editor />
			</LayerStore.Provider>
		</ImageStore.Provider>
	);
}
