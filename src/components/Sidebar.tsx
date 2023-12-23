import { Drive, FolderPaths } from "@/lib/types";
import {
	AppWindowIcon,
	DownloadIcon,
	FileImageIcon,
	FilesIcon,
	HardDriveIcon,
	MusicIcon,
	VideoIcon,
} from "lucide-react";
import DriveComponent from "./DriveComponent";

export default function Sidebar({
	drives,
	folderPaths,
	setPath,
}: {
	drives: Drive[];
	folderPaths: FolderPaths | null;
	setPath: React.Dispatch<React.SetStateAction<string[]>>;
}) {
	const quickAccess = [
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

	return (
		<>
			<aside className="bg-[#ffffff] dark:bg-[#333333] text-black dark:text-white p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
				<h1 className="text-2xl font-bold mb-6">File Explorer</h1>
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
							<DriveComponent drive={drive} setPath={setPath} />
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
