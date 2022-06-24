import type {RECTANGLE} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isRectangle(input: Node): input is RECTANGLE {
  return input.type === "RECTANGLE";
}
