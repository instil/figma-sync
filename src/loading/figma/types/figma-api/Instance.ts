import type {INSTANCE} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isInstance(input: Node): input is INSTANCE {
  return input.type === "INSTANCE";
}
