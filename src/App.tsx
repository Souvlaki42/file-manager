import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import FileExplorer from "./components/FileExplorer";
import { Drive, DriveItem, FolderPaths } from "./lib/types";
import { PathContext } from "./lib/utils";

function App() {
	const [drives, setDrives] = useState<Drive[]>([]);
	const [contents, setContents] = useState<DriveItem[]>([]);
	const [path, setPath] = useState<string[]>(["C:\\"]);
	const [pathIndex, setPathIndex] = useState<number>(0);
	const [folderPaths, setFolderPaths] = useState<FolderPaths | null>(null);

	const [contentsChangeName, setContentsChangeName] = useState<string>("");
	const [template, setTemplate] = useState<DriveItem | undefined>(undefined);

	function backendAccessEnabled() {
		return typeof window.__TAURI_IPC__ === "function";
	}

	async function updateContents() {
		const newContents = await invoke<DriveItem[]>("get_contents", {
			path: path[pathIndex],
		});
		setContents(newContents);
	}

	useEffect(() => {
		(async () => {
			setDrives(await invoke<Drive[]>("get_volumes"));
			setFolderPaths(await invoke<FolderPaths>("get_folder_paths"));
		})();
	}, []);

	useEffect(() => {
		setPathIndex(path.length - 1);
	}, [path]);

	useEffect(() => {
		(async () => {
			await updateContents();
		})();
	}, [pathIndex]);

	return (
		<>
			<PathContext.Provider
				value={{
					path,
					setPath,
					pathIndex,
					setPathIndex,
					contents,
					setContents,
					contentsChangeName,
					setContentsChangeName,
					template,
					setTemplate,
				}}
			>
				{backendAccessEnabled() && (
					<FileExplorer
						drives={drives}
						folderPaths={folderPaths}
						updateContents={updateContents}
					/>
				)}
				{!backendAccessEnabled() && (
					<div className="grid text-center">
						<p>
							This website cannot work without its Tauri backend. Try using the
							app instead.
						</p>
					</div>
				)}
			</PathContext.Provider>
		</>
	);
}

export default App;

