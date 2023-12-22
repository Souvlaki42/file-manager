import { Drive } from "../App";
import "./Drives.css";

function bytesToGB(bytes: number): number {
	const gb = bytes / (1024 * 1024 * 1024);
	return Number(gb.toFixed(2));
}

const Drives = ({ drives }: { drives: Drive[] }) => {
	return (
		<div className="grid-container">
			{drives.map((drive) => (
				<div className="box" key={drive.name}>
					<div className="title">
						{drive.name} ({drive.letter}:)
					</div>
					<div className="progress">
						<div
							className="progress-bar"
							style={{
								width: `${
									(bytesToGB(drive.available_capacity) /
										bytesToGB(drive.total_capacity)) *
									100
								}%`,
							}}
						></div>
					</div>
					<div>
						{bytesToGB(drive.available_capacity)} GB free of&nbsp;
						{bytesToGB(drive.total_capacity)} GB
					</div>
				</div>
			))}
		</div>
	);
};

export default Drives;
