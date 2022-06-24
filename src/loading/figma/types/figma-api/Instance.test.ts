import * as target from "./Instance";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const instanceNode = buildTestNode("INSTANCE");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is instance", () => {
  expect(target.isInstance(instanceNode)).toBe(true);
});

it("should return false if input is not instance", () => {
  expect(target.isInstance(unknownNode)).toBe(false);
});
