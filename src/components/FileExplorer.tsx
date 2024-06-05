import Contents from "./Contents";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function FileExplorer() {
	return (
		<div className="grid h-screen grid-cols-[270px_1fr]">
			<Sidebar />
			<main className="sticky flex-col h-full overflow-y-auto p-6 bg-[#ffffff] dark:bg-[#333333]">
				<Header />
				<Contents />
			</main>
		</div>
	);
}
