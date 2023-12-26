import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function hasPreviousPath(currentPath: string): boolean {
	return (
		countOccurrences(currentPath, "\\") >= 1 &&
		!(currentPath[currentPath.length - 1] === "\\")
	);
}

export function countOccurrences(
	inputString: string,
	targetChar: string
): number {
	let count = 0;
	for (let i = 0; i < inputString.length; i++) {
		if (inputString[i] === targetChar) {
			count++;
		}
	}
	return count;
}

export function bytesToGB(bytes: number): number {
	const gb = bytes / (1024 * 1024 * 1024);
	return Number(gb.toFixed(2));
}

export function calculateFreeSpacePercentageInGB(
	totalSpace: number,
	freeSpace: number
): number {
	if (totalSpace <= 0 || freeSpace <= 0) return 0;

	return Number(((freeSpace / totalSpace) * 100).toFixed(2));
}

export function formatBytesDynamically(bytes: number): string {
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
