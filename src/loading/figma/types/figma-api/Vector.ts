import type {VECTOR} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";
import {isNodeType} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isVector(input: Node): input is Node<VECTOR> {
  return isNodeType(input, "VECTOR");
}
