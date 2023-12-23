import { DriveItem, PathContextType } from "@/lib/types";
import { PathContext } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/tauri";
import { FileIcon, FolderIcon } from "lucide-react";
import { useContext } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

export default function Contents({ contents }: { contents: DriveItem[] }) {
	function formatBytesDynamically(bytes: number): string {
		const kilobyte = 1024;
		const megabyte = kilobyte * 1024;
		const gigabyte = megabyte * 1024;

		if (bytes < kilobyte) {
			return `${bytes} B`;
		} else if (bytes < megabyte) {
			return `${(bytes / kilobyte).toFixed(2)} KB`;
		} else if (bytes < gigabyte) {
			return `${(bytes / megabyte).toFixed(2)} MB`;
		} else {
			return `${(bytes / gigabyte).toFixed(2)} GB`;
		}
	}

	if (PathContext == null)
		return (
			<div className="grid text-center">
				<p>Something went wrong. Try again later.</p>
			</div>
		);

	const { setPath } = useContext(PathContext) as PathContextType;

	return (
		<>
			<Table>
				<TableHeader className="select-none">
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Modified</TableHead>
						<TableHead>Size</TableHead>
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
											: async () =>
													await invoke("open_file", {
														filePath: it.path,
														openWith: true,
													})
									}
								>
									{it.kind === "Directory" && (
										<FolderIcon className="w-6 h-6 mr-2" />
									)}
									{it.kind === "File" && <FileIcon className="w-6 h-6 mr-2" />}
									{it.name}
								</TableCell>
								<TableCell className="pl-2">
									<time dateTime={new Date(it.created).toLocaleString()}>
										{new Date(it.created).toLocaleString()}
									</time>
								</TableCell>
								<TableCell className="pl-2">
									<time dateTime={new Date(it.modified).toLocaleString()}>
										{new Date(it.modified).toLocaleString()}
									</time>
								</TableCell>
								<TableCell>
									{it.kind === "File" ? formatBytesDynamically(it.size) : "-"}
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
		</>
	);
}
