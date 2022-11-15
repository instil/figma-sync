import type {Node, StyleType, VECTOR} from "figma-api/lib/ast-types";

type RealStyleType = Lowercase<StyleType> | "fills";

export type RealStylesMap = {
  [styleType in RealStyleType]?: string;
}

export type NodeWithStyles = Node & {styles: RealStylesMap};
export type NodeWithFills = NodeWithStyles & Pick<VECTOR, "fills">;

export function hasStyleMap(node: Node): node is NodeWithStyles {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return node.styles !== undefined && typeof node.styles === "object";
}

export function hasFills(node: NodeWithStyles): node is NodeWithFills {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Array.isArray(node.fills);
}