import type {Node, NodeType} from "figma-api";
import {isNodeWithChildren} from "./types/NodeWithChildren";
import type {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import type {isInstance} from "@src/loading/figma/types/figma-api/Instance";
import type {isGroup} from "@src/loading/figma/types/figma-api/Group";
import type {isBooleanOperation} from "@src/loading/figma/types/figma-api/BooleanOperation";
import type {isVector} from "@src/loading/figma/types/figma-api/Vector";

export type NodeAnd<Type> = Node & Type;

export function filterChildren(node: Node, filterCallback: typeof isBooleanOperation): Node<"BOOLEAN_OPERATION">[];
export function filterChildren(node: Node, filterCallback: typeof isVector): Node<"VECTOR">[];
export function filterChildren(node: Node, filterCallback: typeof isGroup): Node<"GROUP">[];
export function filterChildren(node: Node, filterCallback: typeof isInstance): Node<"INSTANCE">[];
export function filterChildren(node: Node, filterCallback: typeof isFrame): Node<"FRAME">[];
export function filterChildren<Result extends NodeType = NodeType>(node: Node, filterCallback: (node: Node) => boolean): Node<Result>[];
export function filterChildren<Result extends NodeType = NodeType>(node: Node, filterCallback: (node: Node) => boolean): Node<Result>[] {
  if (!isNodeWithChildren(node)) return [];

  return node.children.filter(filterCallback) as unknown as Node<Result>[];
}
