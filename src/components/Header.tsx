import { countOccurrences, hasPreviousPath } from "@/lib/utils";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	FolderIcon,
	SearchIcon,
} from "lucide-react";
import { useEffect } from "react";
import { state, useAtom } from "./../lib/state";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export default function Header() {
	const [pathInput, setPathInput] = useAtom(state.pathInputState);
	const [pathIndex, setPathIndex] = useAtom(state.pathIndexState);
	const [path, setPath] = useAtom(state.pathState);

	useEffect(() => {
		setPathInput(path[pathIndex]);
	}, [path, pathIndex]);

	return (
		<>
			<header className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-2 w-2/3 mr-2">
					<Button
						title="Back"
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
						title="Forward"
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
						title="Up Directory"
						className="h-10 p-3 select-none"
						variant="outline"
						disabled={!hasPreviousPath(path[pathIndex])}
						onClick={() =>
							setPath((oldPath) => {
								const splitted_array = oldPath[pathIndex].split("\\");
								splitted_array.pop();
								return [
									...oldPath,
									countOccurrences(splitted_array.join("\\"), "\\") === 0
										? splitted_array.join("\\") + "\\"
										: splitted_array.join("\\"),
								];
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
							placeholder={`Search ${path[pathIndex]}`}
							type="search"
						/>
					</div>
					<Select defaultValue="all">
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Search Filter" />
						</SelectTrigger>
						<SelectContent className="select-none">
							<SelectItem value="all">All Contents</SelectItem>
							<SelectItem value="files">Files</SelectItem>
							<SelectItem value="directories">Directories</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</header>
		</>
	);
}
