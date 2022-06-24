import * as target from "./Component";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "./testing/BuildTestNode";

const componentNode = buildTestNode("COMPONENT");

const unknownNode: Node = {
  type: "unknown"
} as unknown as Node;

it("should return true if input is component", () => {
  expect(target.isComponent(componentNode)).toBe(true);
});

it("should return false if input is not component", () => {
  expect(target.isComponent(unknownNode)).toBe(false);
});
