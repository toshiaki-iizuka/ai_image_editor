"use client";

import BgRemove from "./BgRemove";
import BgReplace from "./BgReplace";
import GenFill from "./GenFill";
import GenRemove from "./GenRemove";

const ImageTools = () => {
	return (
		<>
			<GenRemove />
			<BgRemove />
			<BgReplace />
			<GenFill />
		</>
	);
};

export default ImageTools;
