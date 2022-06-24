import type {BOOLEAN_OPERATION, FRAME, GROUP, INSTANCE, Node, VECTOR} from "figma-api";
import type {NodeType} from "./types/NodeType";
import type {NodeWithChildren} from "./types/NodeWithChildren";
import type {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import type {isInstance} from "@src/loading/figma/types/figma-api/Instance";
import type {isGroup} from "@src/loading/figma/types/figma-api/Group";
import type {isBooleanOperation} from "@src/loading/figma/types/figma-api/BooleanOperation";
import type {isVector} from "@src/loading/figma/types/figma-api/Vector";

export type NodeAnd<Type> = Node & Type;

export function filterChildren(node: NodeWithChildren, filterCallback: typeof isBooleanOperation): NodeAnd<BOOLEAN_OPERATION>[];
export function filterChildren(node: NodeWithChildren, filterCallback: typeof isVector): NodeAnd<VECTOR>[];
export function filterChildren(node: NodeWithChildren, filterCallback: typeof isGroup): NodeAnd<GROUP>[];
export function filterChildren(node: NodeWithChildren, filterCallback: typeof isInstance): NodeAnd<INSTANCE>[];
export function filterChildren(node: NodeWithChildren, filterCallback: typeof isFrame): NodeAnd<FRAME>[];
export function filterChildren<Result extends NodeType>(node: NodeWithChildren, filterCallback: (node: Node) => boolean): Result[];
export function filterChildren<Result extends NodeType>(node: NodeWithChildren, filterCallback: (node: Node) => boolean): Result[] {
  return node.children.filter(filterCallback) as unknown as Result[];
}
