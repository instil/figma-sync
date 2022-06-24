import type {COMPONENT} from "figma-api";
import type {Node} from "figma-api/lib/ast-types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isComponent(input: Node): input is COMPONENT {
  return input.type === "COMPONENT";
}
