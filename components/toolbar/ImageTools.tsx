"use client";

import AIRecolor from "./Recolor";
import BgRemove from "./BgRemove";
import BgReplace from "./BgReplace";
import ExtractPart from "./ExtractPart";
import GenFill from "./GenFill";
import GenRemove from "./GenRemove";

const ImageTools = () => {
	return (
		<>
			<GenFill />
			<AIRecolor />
			<GenRemove />
			<BgReplace />
			<ExtractPart />
			<BgRemove />
		</>
	);
};

export default ImageTools;
