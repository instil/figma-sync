import * as target from "./PageExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";

const pageName = "page-name";

const page = {
  ...buildTestNode("CANVAS"),
  name: pageName
};
const figmaGetFileResult: GetFileResult = {
  document: {
    children: [
      buildTestNode("BOOLEAN_OPERATION"),
      page,
      buildTestNode("GROUP")
    ]
  }
} as unknown as GetFileResult;

it("should successfully extract frame", () => {
  const result = target.extractPage({figmaGetFileResult, pageName});

  expect(result).toEqual(page);
});

it("should return undefined if unable to extract frame due to page having no children", () => {
  const updatedFigmaGetFileResult: GetFileResult = {
    ...figmaGetFileResult,
    document: {
      children: []
    }
  } as unknown as GetFileResult;

  expect(target.extractPage({figmaGetFileResult: updatedFigmaGetFileResult, pageName})).toBeUndefined();
});

it("should return undefined if unable to extract frame due to page having no frame as a child", () => {
  const updatedFigmaGetFileResult: GetFileResult = {
    ...figmaGetFileResult,
    document: {
      children: [buildTestNode("BOOLEAN_OPERATION")]
    }
  } as unknown as GetFileResult;

  expect(target.extractPage({figmaGetFileResult: updatedFigmaGetFileResult, pageName})).toBeUndefined();
});

it("should return undefined if unable to extract frame due to page not having a frame with the correct name", () => {
  const updatedFigmaGetFileResult: GetFileResult = {
    ...figmaGetFileResult,
    document: {
      children: [{
        ...page,
        name: "different"
      }]
    }
  } as unknown as GetFileResult;

  expect(target.extractPage({figmaGetFileResult: updatedFigmaGetFileResult, pageName})).toBeUndefined();
});
