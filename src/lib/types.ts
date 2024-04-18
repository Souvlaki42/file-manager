import type { ItemParams } from "react-contexify";

export type DriveItemKind = "Directory" | "File";
export type SearchFilter = "all" | "files" | "directories";
export type DriveItemContextMenuAction =
	| "OPENWITH"
	| "COPYPATH"
	| "RENAME"
	| "DELETE";

export type DriveItem = {
	name: string;
	path: string;
	kind: DriveItemKind;
	hidden: boolean;
	size: number;
	created: Date;
	modified: Date;
};

export type Drive = {
	name: string;
	letter: string;
	total: number;
	available: number;
};

export type FolderPaths = {
	trash: string;
	desktop: string;
	downloads: string;
	documents: string;
	pictures: string;
	music: string;
	videos: string;
};

export type QuickAccessItem = {
	name: string;
	path?: string;
	icon: JSX.Element;
};

export type ContextMenuItem<T, P = any, D = any> = {
	label: string;
	actionId: T;
	onClick: (args: ItemParams<P, D>) => Promise<void>;
	props?: P;
	data?: D;
	seperateNext?: boolean;
	disabled?: boolean;
};
