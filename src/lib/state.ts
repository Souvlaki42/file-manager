import { atom } from "jotai";
import { Drive, DriveItem, FolderPaths } from "./types";
export { useAtom } from "jotai";

const driveState = atom<Drive[]>([]);
const contentState = atom<DriveItem[]>([]);
const pathState = atom<string[]>(["C:\\"]);
const pathIndexState = atom<number>(0);
const folderPathState = atom<FolderPaths | undefined>(undefined);
const pathInputState = atom<string>("");
const nameInputState = atom<string>("");
const driveItemTemplateState = atom<DriveItem | undefined>(undefined);
const selectedDriveItemState = atom<DriveItem | undefined>(undefined);
const editableDriveItemState = atom<DriveItem | undefined>(undefined);

export const state = {
	driveState,
	contentState,
	pathState,
	pathIndexState,
	folderPathState,
	pathInputState,
	nameInputState,
	driveItemTemplateState,
	selectedDriveItemState,
	editableDriveItemState,
};
