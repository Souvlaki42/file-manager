import { Drive, FolderPaths, PathContextType } from "@/lib/types";
import { PathContext, hasPreviousPath } from "@/lib/utils";
import {
	AppWindowIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	DownloadIcon,
	FileImageIcon,
	FilesIcon,
	HardDriveIcon,
	MusicIcon,
	VideoIcon,
} from "lucide-react";
import { useContext } from "react";
import DriveComponent from "./DriveComponent";
import { Button } from "./ui/button";

export default function Sidebar({
	drives,
	folderPaths,
}: {
	drives: Drive[];
	folderPaths: FolderPaths | null;
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

	if (PathContext == null)
		return (
			<div className="grid text-center">
				<p>Something went wrong. Try again later.</p>
			</div>
		);

	const { pathIndex, setPathIndex, path, setPath } = useContext(
		PathContext
	) as PathContextType;

	return (
		<>
			<aside className="bg-[#ffffff] dark:bg-[#333333] text-black dark:text-white p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
				<h1 className="text-2xl font-bold mb-6">File Explorer</h1>
				<div>
					<Button
						className="h-10 p-3 select-none"
						variant="outline"
						disabled={pathIndex === 0}
						onClick={() =>
							pathIndex > 0 ? setPathIndex((index) => index - 1) : {}
						}
					>
						<ArrowLeftIcon className="w-4 h-4" />
						<span className="sr-only">Back</span>
					</Button>
					<Button
						className="h-10 p-3 select-none"
						variant="outline"
						disabled={pathIndex === path.length - 1}
						onClick={() =>
							pathIndex < path.length - 1
								? setPathIndex((index) => index + 1)
								: {}
						}
					>
						<ArrowRightIcon className="w-4 h-4" />
						<span className="sr-only">Forward</span>
					</Button>
					<Button
						className="h-10 p-3 select-none"
						variant="outline"
						disabled={!hasPreviousPath(path[pathIndex])}
						onClick={() =>
							setPath((oldPath) => {
								const splitted_array = oldPath[pathIndex].split("\\");
								splitted_array.pop();
								return [...oldPath, splitted_array.join("\\")];
							})
						}
					>
						<ArrowUpIcon className="w-4 h-4" />
						<span className="sr-only">Up Directory</span>
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
						drives.map((drive) => <DriveComponent drive={drive} />)}
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
