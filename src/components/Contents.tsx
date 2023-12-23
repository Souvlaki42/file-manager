import { PathContextType } from "@/lib/types";
import { PathContext } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/tauri";
import { FileIcon, FolderIcon } from "lucide-react";
import { useContext } from "react";
import { Input } from "./ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

export default function Contents({
	updateContents,
}: {
	updateContents: () => Promise<void>;
}) {
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

	const {
		path,
		setPath,
		contents,
		contentsChangeName,
		setContentsChangeName,
		template,
		setTemplate,
		pathIndex,
	} = useContext(PathContext) as PathContextType;

	async function createFile(fileName: string) {
		const newPath =
			path[pathIndex][path[pathIndex].length - 1] === "\\"
				? path[pathIndex]
				: path[pathIndex] + "\\";
		await invoke("create_file", {
			filePath: newPath + fileName.replace(" ", ""),
		});
		setTemplate(undefined);
		await updateContents();
	}

	async function createFolder(folder_name: string) {
		const newPath =
			path[pathIndex][path[pathIndex].length - 1] === "\\"
				? path[pathIndex]
				: path[pathIndex] + "\\";
		await invoke("create_folder", {
			folderPath: newPath + folder_name.replace(" ", ""),
		});
		setTemplate(undefined);
		await updateContents();
	}

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
					{template && (
						<TableRow key={template.path}>
							<TableCell className="flex flex-row items-center hover:cursor-pointer">
								{template.kind === "Directory" && (
									<FolderIcon className="w-6 h-6 mr-2" />
								)}
								{template.kind === "File" && (
									<FileIcon className="w-6 h-6 mr-2" />
								)}
								<Input
									onKeyDown={async (e) => {
										if (e.key === "Enter" && template.kind === "File")
											await createFile(contentsChangeName);

										if (e.key === "Enter" && template.kind === "Directory")
											await createFolder(contentsChangeName);
									}}
									onChange={(e) => setContentsChangeName(e.target.value)}
									value={contentsChangeName}
									className="w-full pl-8 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500"
									placeholder={template.name}
									type="text"
								/>
							</TableCell>
							<TableCell className="pl-2">
								<time dateTime={new Date(template.created).toLocaleString()}>
									{new Date(template.created).toLocaleString()}
								</time>
							</TableCell>
							<TableCell className="pl-2">
								<time dateTime={new Date(template.modified).toLocaleString()}>
									{new Date(template.modified).toLocaleString()}
								</time>
							</TableCell>
							<TableCell>
								{template.kind === "File"
									? formatBytesDynamically(template.size)
									: "-"}
							</TableCell>
						</TableRow>
					)}
					{contents.length !== 0 &&
						contents.map((it) => {
							return (
								<TableRow key={it.path}>
									<TableCell
										className="flex flex-row items-center hover:cursor-pointer"
										onClick={
											it.kind === "Directory"
												? () => setPath((oldPath) => [...oldPath, it.path])
												: it.kind === "File"
												? async () =>
														await invoke("open_file", {
															filePath: it.path,
															openWith: true,
														})
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
									<TableCell className="pl-2">
										<time dateTime={new Date(it.modified).toLocaleString()}>
											{new Date(it.modified).toLocaleString()}
										</time>
									</TableCell>
									<TableCell>
										{it.kind === "File" ? formatBytesDynamically(it.size) : "-"}
									</TableCell>
								</TableRow>
							);
						})}
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
