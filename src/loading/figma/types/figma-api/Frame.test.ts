import * as target from "./Frame";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const frameNode = buildTestNode("FRAME");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is frame", () => {
  expect(target.isFrame(frameNode)).toBe(true);
});

it("should return false if input is not frame", () => {
  expect(target.isFrame(unknownNode)).toBe(false);
});
