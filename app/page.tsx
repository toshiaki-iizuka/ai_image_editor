"use client";

import Image from "next/image";
import Editor from "@/components/Editor";
import { ImageStore } from "@/lib/image-store";

export default function Home() {
	return (
		<ImageStore.Provider initialValue={{ generating: false }}>
			<main className="h-full">
				<Editor />
			</main>
		</ImageStore.Provider>
	);
}
