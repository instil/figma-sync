import type {CANVAS} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";
import {isNodeType} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isCanvas(input: Node): input is Node<CANVAS> {
  return isNodeType(input, "CANVAS");
}
