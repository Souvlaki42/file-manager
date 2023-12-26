import { createFile, createFolder, getContents } from "@/lib/api";
import { formatBytesDynamically } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/tauri";
import { FileIcon, FolderIcon } from "lucide-react";
import { state, useAtom } from "../lib/state";
import { Input } from "./ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

export default function Contents() {
	const [driveItemTemplate, setDriveItemTemplate] = useAtom(
		state.driveItemTemplateState
	);
	const [nameInput, setNameInput] = useAtom(state.nameInputState);
	const [content, setContent] = useAtom(state.contentState);
	const [path, setPath] = useAtom(state.pathState);
	const [pathIndex, _setPathIndex] = useAtom(state.pathIndexState);
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
					{driveItemTemplate && (
						<TableRow key={driveItemTemplate.path}>
							<TableCell className="flex flex-row items-center hover:cursor-pointer">
								{driveItemTemplate.kind === "Directory" && (
									<FolderIcon className="w-6 h-6 mr-2" />
								)}
								{driveItemTemplate.kind === "File" && (
									<FileIcon className="w-6 h-6 mr-2" />
								)}
								<Input
									onKeyDown={async (e) => {
										if (
											e.key === "Enter" &&
											driveItemTemplate.kind === "File"
										) {
											await createFile(nameInput, path[pathIndex]);
											setDriveItemTemplate(undefined);
											setContent(await getContents(path[pathIndex]));
										}
										if (
											e.key === "Enter" &&
											driveItemTemplate.kind === "Directory"
										) {
											await createFolder(nameInput, path[pathIndex]);
											setDriveItemTemplate(undefined);
											setContent(await getContents(path[pathIndex]));
										}
									}}
									onChange={(e) => setNameInput(e.target.value)}
									value={nameInput}
									className="w-full pl-8 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500"
									placeholder={driveItemTemplate.name}
									type="text"
								/>
							</TableCell>
							<TableCell className="pl-2">
								<time
									dateTime={new Date(
										driveItemTemplate.created
									).toLocaleString()}
								>
									{new Date(driveItemTemplate.created).toLocaleString()}
								</time>
							</TableCell>
							<TableCell className="pl-2">
								<time
									dateTime={new Date(
										driveItemTemplate.modified
									).toLocaleString()}
								>
									{new Date(driveItemTemplate.modified).toLocaleString()}
								</time>
							</TableCell>
							<TableCell>
								{driveItemTemplate.kind === "File"
									? formatBytesDynamically(driveItemTemplate.size)
									: "-"}
							</TableCell>
						</TableRow>
					)}
					{content.length !== 0 &&
						content.map((it) => {
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
					{content.length === 0 && (
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
