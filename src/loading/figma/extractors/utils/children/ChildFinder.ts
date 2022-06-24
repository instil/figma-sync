import type {FRAME, Node, RECTANGLE, TEXT} from "figma-api";
import type {NodeType} from "./types/NodeType";
import type {NodeWithChildren} from "./types/NodeWithChildren";
import type {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import type {isText} from "@src/loading/figma/types/figma-api/Text";
import type {isRectangle} from "@src/loading/figma/types/figma-api/Rectangle";

export function findChild(node: NodeWithChildren, findCallback: typeof isRectangle): RECTANGLE | undefined;
export function findChild(node: NodeWithChildren, findCallback: typeof isText): TEXT | undefined;
export function findChild(node: NodeWithChildren, findCallback: typeof isFrame): FRAME | undefined;
export function findChild<Result extends NodeType>(node: NodeWithChildren, findCallback: (node: Node) => boolean): Result | undefined;
export function findChild<Result extends NodeType>(node: NodeWithChildren, findCallback: (node: Node) => boolean): Result | undefined {
  return node.children.find(findCallback) as unknown as Result | undefined;
}
