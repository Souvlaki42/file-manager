import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import Drives from "./components/Drives";

export type Drive = {
	name: string;
	letter: string;
	total_capacity: number;
	available_capacity: number;
};

enum DriveItemKind {
	Directory,
	File,
}

type DriveItem = {
	name: string;
	path: unknown;
	kind: DriveItemKind;
	hidden: boolean;
};

function App() {
	const [drives, setDrives] = useState<Drive[]>([]);
	const [contents, setContents] = useState<DriveItem[]>([]);
	const [weAreInHomepage, setWeAreInHomepage] = useState<boolean>(true);

	async function get_contents(path: string): Promise<DriveItem[]> {
		setWeAreInHomepage(false);
		const contents = await invoke<DriveItem[]>("get_contents", { path });
		console.log(contents);
		return contents;
	}

	useEffect(() => {
		(async () => {
			setDrives(await invoke<Drive[]>("get_volumes"));
		})();
	}, []);

	return (
		<div className="container">
			<h1>File Manager</h1>
			{weAreInHomepage && drives.length === 0 && <p>No drives found...</p>}
			{!weAreInHomepage && contents.length === 0 && <p>No files found...</p>}
			{weAreInHomepage && drives.length !== 0 && <Drives drives={drives} />}
		</div>
	);
}

export default App;

