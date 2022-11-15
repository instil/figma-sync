import type {Node} from "figma-api";

export type NodeWithChildren =
  | Node<"DOCUMENT">
  | Node<"FRAME">
  | Node<"CANVAS">
  | Node<"BOOLEAN_OPERATION">;

// eslint-disable-next-line
export function isNodeWithChildren(node: any): node is NodeWithChildren {
  return node.children !== undefined && Array.isArray(node.children);
}