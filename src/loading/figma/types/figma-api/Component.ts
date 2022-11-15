import type {COMPONENT} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";
import {isNodeType} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isComponent(input: Node): input is Node<COMPONENT> {
  return isNodeType(input, "COMPONENT");
}
