import * as target from "./ChildFinder";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import type {NodeWithChildren} from "./types/NodeWithChildren";
import type {Node} from "figma-api";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import {isRectangle} from "@src/loading/figma/types/figma-api/Rectangle";
import {isText} from "@src/loading/figma/types/figma-api/Text";

const rectangleNode = buildTestNode("RECTANGLE");
const textNode = buildTestNode("TEXT");
const frameNode = buildTestNode("FRAME");
const nodeWithChildren: NodeWithChildren = {
  children: [
    rectangleNode,
    textNode,
    frameNode
  ]
};

interface TestCase {
  findCallback: (node: Node) => boolean;
  expected: Node | undefined;
}

const testCases: TestCase[] = [
  {findCallback: isRectangle, expected: rectangleNode},
  {findCallback: isText, expected: textNode},
  {findCallback: isFrame, expected: frameNode},
  {findCallback: () => false, expected: undefined},
  {findCallback: () => true, expected: rectangleNode}
];

testCases.forEach(({findCallback, expected}) => {
  it(`should return ${expected} for ${findCallback.name}`, () => {
    const result = target.findChild(nodeWithChildren, findCallback);

    expect(result).toEqual(expected);
  });
});
