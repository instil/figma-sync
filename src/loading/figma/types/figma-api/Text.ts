import type {TEXT} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isText(input: Node): input is TEXT {
  return input.type === "TEXT";
}
