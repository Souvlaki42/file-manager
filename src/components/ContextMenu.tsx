import { ContextMenuItem } from "@/lib/types";
import { Fragment } from "react";
import { Item, Menu, Separator } from "react-contexify";
import "react-contexify/ReactContexify.css";
export { useContextMenu } from "react-contexify";

export default function ContextMenu<T, P = any, D = any>({
	menu_id,
	items,
}: {
	menu_id: string;
	items: ContextMenuItem<T, P, D>[];
}) {
	return (
		<Menu id={menu_id}>
			{items.map((item, index) => (
				<Fragment key={`fragment-${menu_id}-${index}`}>
					<Item
						key={`item-${menu_id}-${index}`}
						id={String(item.actionId)}
						onClick={item.onClick}
						propsFromTrigger={item.props ?? {}}
						data={item.data ?? {}}
						disabled={item.disabled ?? false}
					>
						{item.label}
					</Item>
					{item.seperateNext && (
						<Separator key={`seperator-${menu_id}-${index}`} />
					)}
				</Fragment>
			))}
		</Menu>
	);
}
