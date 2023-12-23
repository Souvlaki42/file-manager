import { Drive, PathContextType } from "@/lib/types";
import { PathContext } from "@/lib/utils";
import { HardDriveIcon } from "lucide-react";
import { useContext } from "react";
import { Progress } from "./ui/progress";

export default function DriveComponent({ drive }: { drive: Drive }) {
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

	if (PathContext == null)
		return (
			<div className="grid text-center">
				<p>Something went wrong. Try again later.</p>
			</div>
		);

	const { setPath } = useContext(PathContext) as PathContextType;

	return (
		<>
			<a
				key={drive.letter}
				className="flex py-1 text-black hover:text-[#000000] hover:bg-[#e5e5e5] rounded-md"
				href="#"
				onClick={() => setPath((oldPath) => [...oldPath, `${drive.letter}:\\`])}
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
		</>
	);
}
