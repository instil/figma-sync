import * as target from "./GetIcons";
import {figmaApi} from "./providers/FigmaApi";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {SvgDictionary} from "./types/design-token/SvgDictionary";
import {extractIcons} from "./extractors/icon-extractor/IconExtractor";
import type {Api as FigmaApi} from "figma-api/lib/api-class";
import {figmaId} from "./providers/Environment";
import {createMockObjectOf, mockFunction} from "@src/shared/testing/jest/JestHelpers";

jest.mock("./providers/FigmaApi");
jest.mock("./extractors/icon-extractor/IconExtractor");
jest.mock("./providers/Environment");

const figmaApiBuilderMock = mockFunction(figmaApi);
const figmaApiMock = createMockObjectOf<FigmaApi>("getFile");
const extractIconsMock = mockFunction(extractIcons);
const figmaIdMock = mockFunction(figmaId);

const getFileResult: GetFileResult = {} as unknown as GetFileResult;
const extractIconsResult: SvgDictionary = {} as unknown as SvgDictionary;

beforeEach(() => {
  figmaApiBuilderMock.mockReturnValue(figmaApiMock);
  figmaApiMock.getFile.mockResolvedValue(getFileResult);
  extractIconsMock.mockResolvedValue(extractIconsResult);
  figmaIdMock.mockReturnValue("figma-id");
});

it("should get figma file and then try to extract icons from it", async () => {
  const result = await target.getIcons();

  expect(result).toEqual(extractIconsResult);
  expect(figmaApiMock.getFile).toHaveBeenCalledWith("figma-id");
  expect(extractIconsMock).toHaveBeenCalledWith(getFileResult);
});
