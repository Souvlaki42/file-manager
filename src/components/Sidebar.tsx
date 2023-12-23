import {
	Drive,
	FolderPaths,
	PathContextType,
	QuickAccessItem,
} from "@/lib/types";
import { PathContext } from "@/lib/utils";
import {
	AppWindowIcon,
	DownloadIcon,
	FileImageIcon,
	FilePlusIcon,
	FilesIcon,
	FolderPlusIcon,
	HardDriveIcon,
	MusicIcon,
	RecycleIcon,
	RefreshCwIcon,
	VideoIcon,
} from "lucide-react";
import { useContext } from "react";
import DriveComponent from "./DriveComponent";
import { Button } from "./ui/button";

export default function Sidebar({
	drives,
	folderPaths,
	updateContents,
}: {
	drives: Drive[];
	folderPaths: FolderPaths | null;
	updateContents: () => Promise<void>;
}) {
	const quickAccess: QuickAccessItem[] = [
		{
			name: "Recycle Bin",
			path: folderPaths?.trash,
			icon: <RecycleIcon className="w-6 h-6 mr-2" />,
		},
		{
			name: "Desktop",
			path: folderPaths?.desktop,
			icon: <AppWindowIcon className="w-6 h-6 mr-2" />,
		},
		{
			name: "Downloads",
			path: folderPaths?.downloads,
			icon: <DownloadIcon className="w-6 h-6 mr-2" />,
		},
		{
			name: "Documents",
			path: folderPaths?.documents,
			icon: <FilesIcon className="w-6 h-6 mr-2" />,
		},
		{
			name: "Pictures",
			path: folderPaths?.pictures,
			icon: <FileImageIcon className="w-6 h-6 mr-2" />,
		},
		{
			name: "Music",
			path: folderPaths?.music,
			icon: <MusicIcon className="w-6 h-6 mr-2" />,
		},
		{
			name: "Videos",
			path: folderPaths?.videos,
			icon: <VideoIcon className="w-6 h-6 mr-2" />,
		},
	];

	if (PathContext == null)
		return (
			<div className="grid text-center">
				<p>Something went wrong. Try again later.</p>
			</div>
		);

	const { path, setPath } = useContext(PathContext) as PathContextType;

	function createFile(fileName: string) {
		console.log(fileName);
		console.log(path);
	}

	return (
		<>
			<aside className="bg-[#ffffff] dark:bg-[#333333] text-black dark:text-white p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
				<h1 className="text-2xl font-bold mb-3">File Explorer</h1>
				<div className="mb-3">
					<Button
						title="New File"
						className="h-10 p-3 mr-2 select-none"
						variant="outline"
					>
						<FilePlusIcon className="w-4 h-4" />
						<span className="sr-only">New File</span>
					</Button>
					<Button
						title="New Folder"
						className="h-10 p-3 mr-2 select-none"
						variant="outline"
					>
						<FolderPlusIcon className="w-4 h-4" />
						<span className="sr-only">New Folder</span>
					</Button>
					<Button
						title="Refresh"
						className="h-10 p-3 select-none"
						variant="outline"
						onClick={async () => await updateContents()}
					>
						<RefreshCwIcon className="w-4 h-4" />
						<span className="sr-only">Refresh</span>
					</Button>
				</div>
				<nav className="space-y-1 select-none">
					<h2 className="text-xl font-semibold mb-2">Quick Access</h2>
					{quickAccess.map((item) => (
						<a
							key={item.name}
							className="py-1 pl-2 flex items-center text-black hover:text-[#000000] hover:bg-[#e5e5e5] rounded-md"
							href="#"
							onClick={() =>
								setPath((oldPath) => [...oldPath, item.path ?? ""])
							}
						>
							{item.icon}
							{item.name}
						</a>
					))}
				</nav>
				<nav className="space-y-1 mt-6">
					<h2 className="text-xl font-semibold mb-2">Volumes</h2>
					{drives.length > 0 &&
						drives.map((drive) => (
							<DriveComponent key={drive.letter} drive={drive} />
						))}
					{drives.length === 0 && (
						<a
							className="flex py-1 text-black hover:text-[#000000] hover:bg-[#e5e5e5] rounded-md"
							href="#"
						>
							<HardDriveIcon className="w-6 h-6 mr-2" />
							No Drives
						</a>
					)}
				</nav>
			</aside>
		</>
	);
}
