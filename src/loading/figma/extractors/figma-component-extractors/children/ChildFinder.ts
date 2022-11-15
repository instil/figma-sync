import type {Node} from "figma-api";
import {isNodeWithChildren} from "./types/NodeWithChildren";
import type {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import type {isText} from "@src/loading/figma/types/figma-api/Text";
import type {isRectangle} from "@src/loading/figma/types/figma-api/Rectangle";
import type {NodeType} from "figma-api/lib/ast-types";

export function findChild(node: Node, findCallback: typeof isRectangle): Node<"RECTANGLE"> | undefined;
export function findChild(node: Node, findCallback: typeof isText): Node<"TEXT"> | undefined;
export function findChild(node: Node, findCallback: typeof isFrame): Node<"FRAME"> | undefined;
export function findChild<Result extends NodeType = NodeType>(node: Node, findCallback: (node: Node) => boolean): Node<Result> | undefined;
export function findChild<Result extends NodeType = NodeType>(node: Node, findCallback: (node: Node) => boolean): Node<Result> | undefined {
  if (!isNodeWithChildren(node)) return undefined;

  return node.children.find(findCallback) as unknown as Node<Result> | undefined;
}
