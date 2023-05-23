import * as target from "./GetIcons";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {SvgDictionary} from "./types/design-token/SvgDictionary";
import {extractIcons} from "./extractors/IconExtractor";
import {figmaId} from "@src/config/providers/Config";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";

jest.mock("./providers/FigmaApi");
jest.mock("./extractors/IconExtractor");
jest.mock("@src/config/providers/Config");

const extractIconsMock = mockFunction(extractIcons);
const figmaIdMock = mockFunction(figmaId);

const getFileResult: GetFileResult = {} as unknown as GetFileResult;
const extractIconsResult: SvgDictionary = {} as unknown as SvgDictionary;

beforeEach(() => {
  extractIconsMock.mockResolvedValue(extractIconsResult);
  figmaIdMock.mockReturnValue("figma-id");
});

it("should get figma file and then try to extract icons from it", async () => {
  const result = await target.getIcons(getFileResult);

  expect(result).toEqual(extractIconsResult);
  expect(extractIconsMock).toHaveBeenCalledWith(getFileResult);
});
