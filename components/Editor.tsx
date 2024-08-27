"use client";

import Image from "next/image";
import LayerPanel from "./layer/LayerPanel";
import UploadImage from "./upload/UploadImage";
import { ModeToggle } from "./theme/ModeToggle";

const Editor = () => {
	return (
		<div className="flex h-full">
			<div className="py-6 px-4 min-w-48 ">
				<div className="pb-12 text-center">
					<ModeToggle />
				</div>
			</div>
			<UploadImage />
			<LayerPanel />
		</div>
	);
};

export default Editor;
