import { atom } from "jotai";
import { Drive, DriveItem, FolderPaths, SearchFilter } from "./types";
export { useAtom } from "jotai";

export const state = {
	driveState: atom<Drive[]>([]),
	contentState: atom<DriveItem[]>([]),
	pathState: atom<string[]>(["C:\\"]),
	pathIndexState: atom<number>(0),
	folderPathState: atom<FolderPaths | undefined>(undefined),
	pathInputState: atom<string>(""),
	nameInputState: atom<string>(""),
	searchInputState: atom<string>(""),
	searchFilterState: atom<SearchFilter>("all"),
	driveItemTemplateState: atom<DriveItem | undefined>(undefined),
	selectedDriveItemState: atom<DriveItem | undefined>(undefined),
	editableDriveItemState: atom<DriveItem | undefined>(undefined),
};
