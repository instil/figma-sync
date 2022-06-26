import * as target from "./ChildFilter";
import type {Node} from "figma-api";
import {isBooleanOperation} from "@src/loading/figma/types/figma-api/BooleanOperation";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import {isVector} from "@src/loading/figma/types/figma-api/Vector";
import {isGroup} from "@src/loading/figma/types/figma-api/Group";
import {isInstance} from "@src/loading/figma/types/figma-api/Instance";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import type {NodeWithChildren} from "./types/NodeWithChildren";

const booleanOperationNode = buildTestNode("BOOLEAN_OPERATION");
const vectorNode = buildTestNode("VECTOR");
const groupNode = buildTestNode("GROUP");
const instanceNode = buildTestNode("INSTANCE");
const frameNode = buildTestNode("FRAME");
const nodeWithChildren: NodeWithChildren = {
  children: [
    booleanOperationNode,
    vectorNode,
    groupNode,
    instanceNode,
    frameNode
  ]
};

interface TestCase {
  filterCallback: (node: Node) => boolean;
  expected: Node[];
}

const testCases: TestCase[] = [
  {filterCallback: isBooleanOperation, expected: [booleanOperationNode]},
  {filterCallback: isVector, expected: [vectorNode]},
  {filterCallback: isGroup, expected: [groupNode]},
  {filterCallback: isInstance, expected: [instanceNode]},
  {filterCallback: isFrame, expected: [frameNode]},
  {filterCallback: () => false, expected: []},
  {
    filterCallback: () => true, expected: [
      booleanOperationNode,
      vectorNode,
      groupNode,
      instanceNode,
      frameNode
    ]
  }
];

testCases.forEach(({filterCallback, expected}) => {
  it(`should return ${expected} for ${filterCallback.name}`, () => {
    const result = target.filterChildren(nodeWithChildren, filterCallback);

    expect(result).toEqual(expected);
  });
});
