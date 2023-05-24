import * as target from "./FileExtractor";
import type {GetFileNodesResult, GetFileResult} from "figma-api/lib/api-types";
import type {NodeWithChildren} from "./figma-component-extractors/children/types/NodeWithChildren";
import type {Node, Style} from "figma-api/lib/ast-types";
import {createMockObjectOf} from "@src/shared/testing/jest/JestHelpers";
import {figmaApi} from "@src/loading/figma/providers/FigmaApi";
import type {Api as FigmaApi} from "figma-api/lib/api-class";
import {figmaId} from "@src/config/providers/Config";

jest.mock("@src/loading/figma/providers/FigmaApi");
jest.mock("@src/config/providers/Config");

const figmaApiBuilderMock = jest.mocked(figmaApi);
const figmaApiMock = createMockObjectOf<FigmaApi>("getFile", "getFileNodes");
const figmaIdMock = jest.mocked(figmaId);

const getFileResult: GetFileResult = {
  document: {
    children: [
      {id: "1"} as NodeWithChildren,
      {id: "2"} as NodeWithChildren,
      {id: "3"} as NodeWithChildren
    ]
  } as Node<"DOCUMENT">,
  styles: {}
} as GetFileResult;

const expectedResult: GetFileResult = {
  ...getFileResult,
  document: {
    children: [
      {
        id: "1",
        children: [
          {id: "1-1"} as NodeWithChildren,
          {id: "1-2"} as NodeWithChildren,
          {id: "1-3"} as NodeWithChildren
        ]
      } as NodeWithChildren,
      {
        id: "2",
        children: [
          {id: "2-1"} as NodeWithChildren,
          {id: "2-2"} as NodeWithChildren,
          {id: "2-3"} as NodeWithChildren
        ]
      } as NodeWithChildren,
      {
        id: "3",
        children: [
          {id: "3-1"} as NodeWithChildren,
          {id: "3-2"} as NodeWithChildren,
          {id: "3-3"} as NodeWithChildren
        ]
      } as NodeWithChildren
    ]
  } as Node<"DOCUMENT">,
  styles: {
    "1-1": {} as unknown as Style,
    "2-1": {} as unknown as Style,
    "3-1": {} as unknown as Style
  }
};

beforeEach(() => {
  figmaIdMock.mockReturnValue("figma-id");
  figmaApiBuilderMock.mockReturnValue(figmaApiMock);
  figmaApiMock.getFile.mockResolvedValue(getFileResult);
  figmaApiMock.getFileNodes.mockImplementation(async (figmaId, nodeId): Promise<GetFileNodesResult> => {
    return <GetFileNodesResult>{
      nodes: {
        "1": {
          document: {
            children: [
              {id: `${nodeId}-1`} as NodeWithChildren,
              {id: `${nodeId}-2`} as NodeWithChildren,
              {id: `${nodeId}-3`} as NodeWithChildren
            ]
          },
          styles: {
            [`${nodeId}-1`]: {} as unknown as Style
          }
        }
      } as unknown as GetFileNodesResult["nodes"]
    } as GetFileNodesResult;
  });
});

it("should extract file, and then download each page individually", async () => {
  const result = await target.extractFile();

  expect(result).toEqual(expectedResult);
});