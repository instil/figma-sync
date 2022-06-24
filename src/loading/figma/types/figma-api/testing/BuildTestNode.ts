import type {Node} from "figma-api";
import type {NodeType} from "figma-api/lib/ast-types";

export const buildTestNode = (type: NodeType): Node => ({
  type
} as unknown as Node);
