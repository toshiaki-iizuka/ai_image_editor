"use client";

import ActiveImage from "./upload/ActiveImage";
import ImageTools from "./toolbar/ImageTools";
import LayerPanel from "./layer/LayerPanel";
import Loading from "./LoadingScreen";
import UploadForm from "./upload/UploadForm";
import VideoTools from "./toolbar/VideoTools";
import { ModeToggle } from "./theme/ModeToggle";
import { useLayerStore } from "@/lib/layer-store";

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
					{activeLayer.resourceType === "video" ? <VideoTools /> : null}
				</div>
			</div>
			<Loading />
			<UploadForm />
			<ActiveImage />
			<LayerPanel />
		</div>
	);
};

export default Editor;
