import { useEffect } from "react";
import FileExplorer from "./components/FileExplorer";
import { getContents, getFolderPaths, getVolumes } from "./lib/api";
import { state, useAtom } from "./lib/state";

export default function App() {
	const [pathIndex, setPathIndex] = useAtom(state.pathIndexState);
	const [path, _setPath] = useAtom(state.pathState);
	const [_folderPaths, setFolderPaths] = useAtom(state.folderPathState);
	const [_drives, setDrives] = useAtom(state.driveState);
	const [_content, setContent] = useAtom(state.contentState);
	const [searchInput, _setSearchInput] = useAtom(state.searchInputState);

	useEffect(() => {
		(async () => {
			const volumes = await getVolumes();
			setDrives(volumes);
			const paths = await getFolderPaths();
			setFolderPaths(paths);
		})();
	}, []);

	useEffect(() => {
		setPathIndex(path.length - 1);
	}, [path]);

	useEffect(() => {
		(async () => {
			const newContents = await getContents(path[pathIndex], !!searchInput);
			setContent(newContents);
		})();
	}, [pathIndex, searchInput]);

	if (typeof window.__TAURI_IPC__ === "function") return <FileExplorer />;
	else
		return (
			<div className="grid text-center">
				<p>This website doesn't work. Use the desktop app instead.</p>
			</div>
		);
}

