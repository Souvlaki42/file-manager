import { Drive, DriveItem, FolderPaths } from "@/lib/types";
import Contents from "./Contents";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function FileExplorer({
	drives,
	pathState,
	contents,
	folderPaths,
	pathIndexState,
}: {
	drives: Drive[];
	pathState: [string[], React.Dispatch<React.SetStateAction<string[]>>];
	pathIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
	contents: DriveItem[];
	folderPaths: FolderPaths | null;
}) {
	const [path, setPath] = pathState;

	return (
		<div className="grid h-screen grid-cols-[300px_1fr]">
			<Sidebar drives={drives} folderPaths={folderPaths} setPath={setPath} />
			<main className="sticky flex-col h-full overflow-y-auto p-6 bg-[#ffffff] dark:bg-[#333333]">
				<Header pathState={[path, setPath]} pathIndexState={pathIndexState} />
				<Contents contents={contents} setPath={setPath} />
			</main>
		</div>
	);
}
