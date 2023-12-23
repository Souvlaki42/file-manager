type DriveItemKind = "Directory" | "File";

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
	total_capacity: number;
	available_capacity: number;
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

export type PathContextType = {
	path: string[];
	setPath: React.Dispatch<React.SetStateAction<string[]>>;
	pathIndex: number;
	setPathIndex: React.Dispatch<React.SetStateAction<number>>;
};
