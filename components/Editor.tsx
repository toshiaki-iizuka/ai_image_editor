"use client";

import Image from "next/image";
import UploadImage from "./upload/UploadImage";
import LayerPanel from "./layer/LayerPanel";

const Editor = () => {
	return (
		<div className="flex h-full">
			<UploadImage />
			<LayerPanel />
		</div>
	);
};

export default Editor;
