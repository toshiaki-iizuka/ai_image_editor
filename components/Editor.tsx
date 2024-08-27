"use client";

import Image from "next/image";
import UploadImage from "./upload/UploadImage";

const Editor = () => {
	return (
		<div>
			<h1>Editor</h1>
			<UploadImage />
		</div>
	);
};

export default Editor;
