import type {GROUP} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isGroup(input: Node): input is GROUP {
  return input.type === "GROUP";
}
