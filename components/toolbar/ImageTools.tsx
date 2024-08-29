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
			<GenRemove />
			<AIRecolor />
			<BgRemove />
			<BgReplace />
			<GenFill />
			<ExtractPart />
		</>
	);
};

export default ImageTools;
