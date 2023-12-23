/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pEbP3kbD2At
 */
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Drive, DriveItem, FolderPaths } from "@/lib/types";
import {
	AppWindowIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	DownloadIcon,
	FileIcon,
	FileImageIcon,
	FilesIcon,
	FilterIcon,
	FolderIcon,
	HardDriveIcon,
	MoreHorizontalIcon,
	MusicIcon,
	SearchIcon,
	VideoIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

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
	const [pathIndex, setPathIndex] = pathIndexState;

	const [pathInput, setPathInput] = useState<string>(path[path.length - 1]);

	function hasPreviousPath(): boolean {
		return (
			countOccurrences(path[pathIndex], "\\") >= 1 &&
			!(path[pathIndex][path[pathIndex].length - 1] === "\\")
		);
	}

	function countOccurrences(inputString: string, targetChar: string): number {
		let count = 0;
		for (let i = 0; i < inputString.length; i++) {
			if (inputString[i] === targetChar) {
				count++;
			}
		}
		return count;
	}

	function bytesToGB(bytes: number): number {
		const gb = bytes / (1024 * 1024 * 1024);
		return Number(gb.toFixed(2));
	}

	function calculateFreeSpacePercentageInGB(
		totalSpace: number,
		freeSpace: number
	): number {
		if (totalSpace <= 0 || freeSpace <= 0) return 0;

		return Number(((freeSpace / totalSpace) * 100).toFixed(2));
	}

	useEffect(() => {
		setPathInput(path[pathIndex]);
	}, [path, pathIndex]);

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
		<div className="grid h-screen grid-cols-[300px_1fr]">
			<aside className="bg-[#ffffff] dark:bg-[#333333] text-black dark:text-white p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
				<h1 className="text-2xl font-bold mb-6">File Explorer</h1>
				<nav className="space-y-1">
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
							<a
								key={drive.letter}
								className="flex py-1 text-black hover:text-[#000000] hover:bg-[#e5e5e5] rounded-md"
								href="#"
								onClick={() =>
									setPath((oldPath) => [...oldPath, `${drive.letter}:\\`])
								}
							>
								<div className="pl-2">
									<div className="flex mb-1">
										<HardDriveIcon className="w-6 h-6 mr-2" />
										{drive.name}&nbsp;({drive.letter}:)
									</div>
									<div className="mb-1">
										<Progress
											value={calculateFreeSpacePercentageInGB(
												bytesToGB(drive.total_capacity),
												bytesToGB(drive.available_capacity)
											)}
										/>
									</div>
									<div>
										{bytesToGB(drive.available_capacity)} GB free of&nbsp;
										{bytesToGB(drive.total_capacity)} GB
									</div>
								</div>
							</a>
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
			<main className="sticky flex-col h-full overflow-y-auto p-6 bg-[#ffffff] dark:bg-[#333333]">
				<header className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-2 w-2/3 mr-2">
						<Button
							className="h-10 p-3"
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
							className="h-10 p-3"
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
							className="h-10 p-3"
							variant="outline"
							disabled={!hasPreviousPath()}
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
						<div className="relative w-full ml-2">
							<FolderIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
							<Input
								onKeyDown={(e) => {
									if (e.key === "Enter")
										setPath((oldPath) => [...oldPath, pathInput]);
								}}
								onChange={(e) => setPathInput(e.target.value)}
								value={pathInput}
								className="w-full pl-8 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500"
								placeholder="This PC > Documents"
								type="text"
							/>
						</div>
					</div>
					<div className="flex items-center space-x-2 w-1/3">
						<div className="relative w-full">
							<SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
							<Input
								className="w-full pl-8 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500"
								placeholder="Search files"
								type="search"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="icon" variant="outline">
									<FilterIcon className="w-4 h-4" />
									<span className="sr-only">Filter Files</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>All Files</DropdownMenuItem>
								<DropdownMenuItem>Directories</DropdownMenuItem>
								<DropdownMenuItem>Files</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Modified</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{contents.length !== 0 &&
							contents.map((it) => (
								<TableRow key={it.path}>
									<TableCell
										className="flex flex-row hover:cursor-pointer"
										onClick={
											it.kind === "Directory"
												? () => setPath((oldPath) => [...oldPath, it.path])
												: () => {}
										}
									>
										{it.kind === "Directory" && (
											<FolderIcon className="w-6 h-6 mr-2" />
										)}
										{it.kind === "File" && (
											<FileIcon className="w-6 h-6 mr-2" />
										)}
										{it.name}
									</TableCell>
									<TableCell className="pl-2">
										<time dateTime={new Date(it.created).toLocaleString()}>
											{new Date(it.created).toLocaleString()}
										</time>
									</TableCell>
									<TableCell>
										<time dateTime={new Date(it.modified).toLocaleString()}>
											{new Date(it.modified).toLocaleString()}
										</time>
									</TableCell>
									<TableCell>
										<Button size="icon" variant="outline">
											<MoreHorizontalIcon className="w-4 h-4" />
											<span className="sr-only">More</span>
										</Button>
									</TableCell>
								</TableRow>
							))}
						{contents.length === 0 && (
							<TableRow>
								<TableCell colSpan={4}>
									This directory either has no contents or it doesn't exist.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</main>
		</div>
	);
}
