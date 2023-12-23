import { Drive } from "@/lib/types";
import { HardDriveIcon } from "lucide-react";
import { Progress } from "./ui/progress";

export default function DriveComponent({
	drive,
	setPath,
}: {
	drive: Drive;
	setPath: React.Dispatch<React.SetStateAction<string[]>>;
}) {
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
