"use client";

import Image from "next/image";
import ActiveImage from "./upload/ActiveImage";
import LayerPanel from "./layer/LayerPanel";
import UploadForm from "./upload/UploadForm";
import UploadImage from "./upload/UploadImage";
import { ModeToggle } from "./theme/ModeToggle";
import { useLayerStore } from "@/lib/layer-store";
import ImageTools from "./toolbar/ImageTools";

const Editor = () => {
	const activeLayer = useLayerStore((state) => state.activeLayer);

	return (
		<div className="flex h-full">
			<div className="py-6 px-4 min-w-48 ">
				<div className="pb-12 text-center">
					<ModeToggle />
				</div>
				<div className="flex flex-col gap-4 ">
					{activeLayer.resourceType === "image" ? <ImageTools /> : null}
				</div>
			</div>
			<UploadForm />
			<ActiveImage />
			<LayerPanel />
		</div>
	);
};

export default Editor;
