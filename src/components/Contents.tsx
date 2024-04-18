import {
	createFile,
	createFolder,
	deleteFile,
	deleteFolder,
	getContents,
	openFile,
	renameItem,
} from "@/lib/api";
import { DriveItem, DriveItemContextMenuAction } from "@/lib/types";
import { cn, formatBytesDynamically } from "@/lib/utils";
import { FileIcon, FolderIcon } from "lucide-react";
import { Fragment, useMemo } from "react";
import { state, useAtom } from "../lib/state";
import ContextMenu, { useContextMenu } from "./ContextMenu";
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
	const { show: showDriveItemContextMenu } = useContextMenu({
		id: "driveItemContextMenu",
	});

	const [driveItemTemplate, setDriveItemTemplate] = useAtom(
		state.driveItemTemplateState
	);
	const [selectedDriveItem, setSelectedDriveItem] = useAtom(
		state.selectedDriveItemState
	);
	const [editableDriveItem, setEditableDriveItem] = useAtom(
		state.editableDriveItemState
	);
	const [nameInput, setNameInput] = useAtom(state.nameInputState);
	const [content, setContent] = useAtom(state.contentState);
	const [path, setPath] = useAtom(state.pathState);
	const [pathIndex, _setPathIndex] = useAtom(state.pathIndexState);
	const [searchInput, _setSearchInput] = useAtom(state.searchInputState);
	const [searchFilter, _setSearchFilter] = useAtom(state.searchFilterState);

	const filteredContent = useMemo(() => {
		console.log(content);
		return content.filter(
			(item) =>
				item.name.toLowerCase().includes(searchInput.toLowerCase()) &&
				(searchFilter === "files"
					? item.kind === "File"
					: searchFilter === "directories"
					? item.kind === "Directory"
					: true)
		);
	}, [searchInput, searchFilter, content]);

	return (
		<>
			<ContextMenu<DriveItemContextMenuAction, { driveItem?: DriveItem }>
				menu_id="driveItemContextMenu"
				items={[
					{
						label: "Open With",
						actionId: "OPENWITH",
						props: { driveItem: selectedDriveItem },
						onClick: async (args) => {
							const it = args.props?.driveItem;
							if (!it) return;
							await openFile(it.path, true);
						},
					},
					{
						label: "Copy Path",
						actionId: "COPYPATH",
						props: { driveItem: selectedDriveItem },
						onClick: async (args) => {
							const it = args.props?.driveItem;
							if (!it) return;
							navigator.clipboard.writeText(it.path);
						},
					},
					{
						label: "Rename",
						actionId: "RENAME",
						props: { driveItem: selectedDriveItem },
						onClick: async (args) => {
							const it = args.props?.driveItem;
							if (!it) return;
							setNameInput(it.name);
							setEditableDriveItem(it);
						},
					},
					{
						label: "Delete",
						actionId: "DELETE",
						props: { driveItem: selectedDriveItem },
						onClick: async (args) => {
							const it = args.props?.driveItem;
							if (!it) return;
							if (it.kind === "File")
								await deleteFile(it.name, path[pathIndex]);
							if (it.kind === "Directory")
								await deleteFolder(it.name, path[pathIndex]);
							setContent(await getContents(path[pathIndex]));
						},
					},
				]}
			/>
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
					{filteredContent.length !== 0 &&
						filteredContent.map((it) => {
							return (
								<Fragment key={`fragment-${it.path}`}>
									<TableRow
										key={`item-${it.path}`}
										className={cn(it.hidden ? "opacity-50" : "opacity-100")}
									>
										<TableCell
											className="flex flex-row items-center hover:cursor-pointer"
											onContextMenu={(event) => {
												setSelectedDriveItem(it);
												showDriveItemContextMenu({ event });
											}}
											onClick={
												editableDriveItem !== it && it.kind === "Directory"
													? () => setPath((oldPath) => [...oldPath, it.path])
													: editableDriveItem !== it && it.kind === "File"
													? async () => await openFile(it.path, false)
													: () => {}
											}
										>
											{it.kind === "Directory" && (
												<FolderIcon className="w-6 h-6 mr-2" />
											)}
											{it.kind === "File" && (
												<FileIcon className="w-6 h-6 mr-2" />
											)}
											{editableDriveItem === it ? (
												<Input
													onKeyDown={async (e) => {
														if (e.key === "Enter") {
															const currentPath = path[pathIndex];
															const newPath = currentPath.endsWith("\\")
																? currentPath.slice(0, -1)
																: currentPath;
															await renameItem(
																newPath + "\\" + editableDriveItem.name,
																nameInput
															);
															setEditableDriveItem(undefined);
															setContent(await getContents(path[pathIndex]));
														}
													}}
													onChange={(e) => setNameInput(e.target.value)}
													value={nameInput}
													className="w-full pl-8 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500"
													placeholder={editableDriveItem.name}
													type="text"
												/>
											) : (
												it.name
											)}
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
											{it.kind === "File"
												? formatBytesDynamically(it.size)
												: "-"}
										</TableCell>
									</TableRow>
								</Fragment>
							);
						})}
					{filteredContent.length === 0 && (
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
