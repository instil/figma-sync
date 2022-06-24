import * as target from "./Vector";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const vectorNode = buildTestNode("VECTOR");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is vector", () => {
  expect(target.isVector(vectorNode)).toBe(true);
});

it("should return false if input is not vector", () => {
  expect(target.isVector(unknownNode)).toBe(false);
});
