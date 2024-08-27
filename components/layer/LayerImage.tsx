"use client";

import type { Layer } from "@/lib/layer-store";
import Image from "next/image";

const LayerImage = ({ layer }: { layer: Layer }) => {
	if (layer.url && layer.name)
		return (
			<div>
				<div className="w-12 h-12 flex items-center justify-center">
					<Image
						className="w-full object-contain h-full rounded-sm"
						alt={layer.name}
						src={layer.format === "mp4" ? layer.poster || layer.url : layer.url}
						width={50}
						height={50}
					/>
				</div>
				<div className="relative">
					<p className="text-xs">{`${layer.name?.slice(0, 15)}.${
						layer.format
					}`}</p>
				</div>
			</div>
		);
};

export default LayerImage;
