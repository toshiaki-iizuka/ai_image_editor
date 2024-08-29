import React from "react";
import createZustandContext from "./zustand-context";
import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import { useStore } from "zustand";

type State = {
	tags: string[];
	setTags: (tags: string[]) => void;
	activeTag: string;
	setActiveTag: (tag: string) => void;
	generating: boolean;
	setGenerating: (generating: boolean) => void;
};

const getStore = (initialState: {
	activeTag: string;
	generating: boolean;
}) => {
	return createStore<State>()(
		persist(
			(set) => ({
				tags: [],
				activeTag: initialState.activeTag,
				setTags: (tags) => set({ tags }),
				setActiveTag: (tag) => set({ activeTag: tag }),
				generating: initialState.generating,
				setGenerating: (generating) => set({ generating }),
			}),
			{
				name: "image-store",
				storage: createJSONStorage(() => localStorage),
			},
		),
	);
};

export const ImageStore = createZustandContext(getStore);

export function useImageStore<T>(selector: (state: State) => T) {
	const store = React.useContext(ImageStore.Context);
	if (!store) {
		throw new Error("Missing ImageStore provider");
	}
	return useStore(store, selector);
}
