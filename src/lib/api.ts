import { invoke } from "@tauri-apps/api/tauri";
import { Drive, DriveItem, FolderPaths } from "./types";

export const getFolderPaths = async (): Promise<FolderPaths> => {
	const data = await invoke<FolderPaths>("get_folder_paths");
	return data;
};

export const getVolumes = async (): Promise<Drive[]> => {
	const data = await invoke<Drive[]>("get_volumes");
	return data;
};

export const getContents = async (path: string): Promise<DriveItem[]> => {
	const data = await invoke<DriveItem[]>("get_contents", { path });
	return data;
};

export const createFile = async (
	fileName: string,
	currentPath: string
): Promise<void> => {
	const newPath = currentPath.endsWith("\\") ? currentPath : currentPath + "\\";
	await invoke<void>("create_file", {
		filePath: newPath + fileName.replace(" ", ""),
	});
};

export const deleteFile = async (
	fileName: string,
	currentPath: string
): Promise<void> => {
	const newPath = currentPath.endsWith("\\") ? currentPath : currentPath + "\\";
	await invoke<void>("delete_file", {
		filePath: newPath + fileName.replace(" ", ""),
	});
};

export const createFolder = async (
	folderName: string,
	currentPath: string
): Promise<void> => {
	const newPath = currentPath.endsWith("\\") ? currentPath : currentPath + "\\";
	await invoke<void>("create_folder", {
		folderPath: newPath + folderName.replace(" ", ""),
	});
};

export const deleteFolder = async (
	folderName: string,
	currentPath: string
): Promise<void> => {
	const newPath = currentPath.endsWith("\\") ? currentPath : currentPath + "\\";
	await invoke<void>("delete_folder", {
		folderPath: newPath + folderName.replace(" ", ""),
	});
};

export const openFile = async (filePath: string, openWith: boolean = false) => {
	await invoke<void>("open_file", { filePath: filePath, openWith });
};

export const renameItem = async (oldPath: string, newName: string) => {
	await invoke<void>("rename_item", { oldPath, newName });
};
