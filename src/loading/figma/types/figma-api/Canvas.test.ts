import * as target from "./Canvas";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const canvasNode = buildTestNode("CANVAS");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is canvas", () => {
  expect(target.isCanvas(canvasNode)).toBe(true);
});

it("should return false if input is not canvas", () => {
  expect(target.isCanvas(unknownNode)).toBe(false);
});
