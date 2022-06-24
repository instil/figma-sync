import type {BOOLEAN_OPERATION, CANVAS, DOCUMENT, FRAME} from "figma-api";

export type NodeWithChildren =
  | DOCUMENT
  | FRAME
  | CANVAS
  | BOOLEAN_OPERATION;
