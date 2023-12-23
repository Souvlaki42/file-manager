import { clsx, type ClassValue } from "clsx";
import { createContext } from "react";
import { twMerge } from "tailwind-merge";
import { PathContextType } from "./types";

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

export const PathContext = createContext<PathContextType | null>(null);

