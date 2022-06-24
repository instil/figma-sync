import * as target from "./Text";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const textNode = buildTestNode("TEXT");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is text", () => {
  expect(target.isText(textNode)).toBe(true);
});

it("should return false if input is not text", () => {
  expect(target.isText(unknownNode)).toBe(false);
});
