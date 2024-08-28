"use client";

import BgRemove from "./BgRemove";
import BgReplace from "./BgReplace";
import ExtractPart from "./ExtractPart";
import GenFill from "./GenFill";
import GenRemove from "./GenRemove";

const ImageTools = () => {
	return (
		<>
			<GenRemove />
			<BgRemove />
			<BgReplace />
			<GenFill />
			<ExtractPart />
		</>
	);
};

export default ImageTools;
