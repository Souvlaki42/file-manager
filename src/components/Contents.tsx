import { DriveItem } from "@/lib/types";
import { invoke } from "@tauri-apps/api/tauri";
import { FileIcon, FolderIcon } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

export default function Contents({
	contents,
	setPath,
}: {
	contents: DriveItem[];
	setPath: React.Dispatch<React.SetStateAction<string[]>>;
}) {
	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Modified</TableHead>
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
													await invoke("open_file_with", {
														filePath: it.path,
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
								<TableCell>
									<time dateTime={new Date(it.modified).toLocaleString()}>
										{new Date(it.modified).toLocaleString()}
									</time>
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
