import * as target from "./BooleanOperation";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const booleanOperationNode = buildTestNode("BOOLEAN_OPERATION");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is boolean operation", () => {
  expect(target.isBooleanOperation(booleanOperationNode)).toBe(true);
});

it("should return false if input is not boolean operation", () => {
  expect(target.isBooleanOperation(unknownNode)).toBe(false);
});
