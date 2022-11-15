import type {BOOLEAN_OPERATION} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";
import {isNodeType} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isBooleanOperation(input: Node): input is Node<BOOLEAN_OPERATION> {
  return isNodeType(input, "BOOLEAN_OPERATION");
}
