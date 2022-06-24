import * as target from "./Rectangle";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const rectangleNode = buildTestNode("RECTANGLE");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is rectangle", () => {
  expect(target.isRectangle(rectangleNode)).toBe(true);
});

it("should return false if input is not rectangle", () => {
  expect(target.isRectangle(unknownNode)).toBe(false);
});
