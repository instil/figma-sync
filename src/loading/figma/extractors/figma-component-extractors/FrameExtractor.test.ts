import * as target from "./FrameExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";
import {extractPage} from "./PageExtractor";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import type {Node} from "figma-api/lib/ast-types";

jest.mock("./PageExtractor");

const extractPageMock = jest.mocked(extractPage);

const figmaGetFileResult: GetFileResult = {} as unknown as GetFileResult;
const pageName = "page-name";
const frameName = "frame-name";

const frame = {
  ...buildTestNode("FRAME"),
  name: frameName
};
const extractPageResultWithFrame: Node<"CANVAS"> = {
  children: [
    buildTestNode("BOOLEAN_OPERATION"),
    frame,
    buildTestNode("GROUP")
  ]
} as Node<"CANVAS">;

beforeEach(() => {
  extractPageMock.mockReturnValue(extractPageResultWithFrame);
});

it("should successfully extract frame", () => {
  const result = target.extractFrame({figmaGetFileResult, pageName, frameName});

  expect(result).toEqual(frame);
  expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName});
});

it("should return undefined if unable to extract frame due to page having no children", () => {
  extractPageMock.mockReturnValue({
    ...extractPageResultWithFrame,
    children: []
  });

  expect(target.extractFrame({figmaGetFileResult, pageName, frameName})).toBeUndefined();
  expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName});
});

it("should return undefined if unable to extract frame due to page having no frame as a child", () => {
  extractPageMock.mockReturnValue({
    ...extractPageResultWithFrame,
    children: [buildTestNode("BOOLEAN_OPERATION")]
  });

  expect(target.extractFrame({figmaGetFileResult, pageName, frameName})).toBeUndefined();
  expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName});
});

it("should return undefined if unable to extract frame due to page not having a frame with the correct name", () => {
  extractPageMock.mockReturnValue({
    ...extractPageResultWithFrame,
    children: [{
      ...frame,
      name: "different"
    }]
  });

  expect(target.extractFrame({figmaGetFileResult, pageName, frameName})).toBeUndefined();
  expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName});
});
