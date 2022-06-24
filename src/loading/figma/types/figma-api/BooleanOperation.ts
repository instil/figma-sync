import type {BOOLEAN_OPERATION} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isBooleanOperation(input: Node): input is BOOLEAN_OPERATION {
  return input.type === "BOOLEAN_OPERATION";
}
