import * as target from "./Group";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const groupNode = buildTestNode("GROUP");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is group", () => {
  expect(target.isGroup(groupNode)).toBe(true);
});

it("should return false if input is not group", () => {
  expect(target.isGroup(unknownNode)).toBe(false);
});
