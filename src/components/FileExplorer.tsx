import { Drive, FolderPaths } from "@/lib/types";
import Contents from "./Contents";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function FileExplorer({
	drives,
	folderPaths,
	updateContents,
}: {
	drives: Drive[];
	folderPaths: FolderPaths | null;
	updateContents: () => Promise<void>;
}) {
	return (
		<div className="grid h-screen grid-cols-[270px_1fr]">
			<Sidebar
				updateContents={updateContents}
				drives={drives}
				folderPaths={folderPaths}
			/>
			<main className="sticky flex-col h-full overflow-y-auto p-6 bg-[#ffffff] dark:bg-[#333333]">
				<Header />
				<Contents updateContents={updateContents} />
			</main>
		</div>
	);
}
