import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import FileExplorer from "./components/FileExplorer";
import { Drive, DriveItem, FolderPaths } from "./lib/types";

function App() {
	const [drives, setDrives] = useState<Drive[]>([]);
	const [contents, setContents] = useState<DriveItem[]>([]);
	const [path, setPath] = useState<string[]>(["C:\\"]);
	const [pathIndex, setPathIndex] = useState<number>(0);
	const [folderPaths, setFolderPaths] = useState<FolderPaths | null>(null);

	function backendAccessEnabled() {
		return typeof window.__TAURI_IPC__ === "function";
	}

	async function update_contents() {
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
			await update_contents();
		})();
	}, [pathIndex]);

	return (
		<>
			{backendAccessEnabled() && (
				<FileExplorer
					drives={drives}
					pathState={[path, setPath]}
					pathIndexState={[pathIndex, setPathIndex]}
					contents={contents}
					folderPaths={folderPaths}
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
		</>
	);
}

export default App;

