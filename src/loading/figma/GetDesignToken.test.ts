import * as target from "./GetDesignToken";
import type {DesignToken} from "./types/design-token/DesignToken";
import type {DesignTokenColors} from "./types/design-token/types/DesignTokenColors";
import type {DesignTokenFonts} from "./types/design-token/types/DesignTokenFonts";
import type {DesignTokenSpacers} from "./types/design-token/types/DesignTokenSpacers";
import type {GetFileResult} from "figma-api/lib/api-types";
import {figmaApi} from "./providers/FigmaApi";
import {extractColors} from "./extractors/ColorExtractor";
import {extractFonts} from "./extractors/FontExtractor";
import {extractSpacers} from "./extractors/SpacerExtractor";
import {extractShadows} from "./extractors/ShadowExtractor";
import type {Api as FigmaApi} from "figma-api/lib/api-class";
import {figmaId} from "./providers/Environment";
import {createMockObjectOf, mockFunction} from "@src/shared/testing/jest/JestHelpers";
import type {DesignTokenShadows} from "./types/design-token/types/DesignTokenShadows";

jest.mock("./providers/FigmaApi");
jest.mock("./extractors/ColorExtractor");
jest.mock("./extractors/FontExtractor");
jest.mock("./extractors/SpacerExtractor");
jest.mock("./extractors/ShadowExtractor");
jest.mock("./providers/Environment");

const figmaApiBuilderMock = mockFunction(figmaApi);
const figmaApiMock = createMockObjectOf<FigmaApi>("getFile");
const extractColorsMock = mockFunction(extractColors);
const extractFontsMock = mockFunction(extractFonts);
const extractSpacersMock = mockFunction(extractSpacers);
const extractShadowsMock = mockFunction(extractShadows);
const figmaIdMock = mockFunction(figmaId);

const getFileResult: GetFileResult = {} as unknown as GetFileResult;
const extractColorsResult: DesignTokenColors = {} as unknown as DesignTokenColors;
const extractFontsResult: DesignTokenFonts = {} as unknown as DesignTokenFonts;
const extractSpacersResult: DesignTokenSpacers = {} as unknown as DesignTokenSpacers;
const extractShadowsResult: DesignTokenShadows = {} as unknown as DesignTokenShadows;

beforeEach(() => {
  figmaApiBuilderMock.mockReturnValue(figmaApiMock);
  figmaApiMock.getFile.mockResolvedValue(getFileResult);
  extractColorsMock.mockReturnValue(extractColorsResult);
  extractFontsMock.mockReturnValue(extractFontsResult);
  extractSpacersMock.mockReturnValue(extractSpacersResult);
  extractShadowsMock.mockReturnValue(extractShadowsResult);
  figmaIdMock.mockReturnValue("figma-id");
});

it("should create design token from figma file", async () => {
  const result = await target.getDesignToken();

  const expected: DesignToken = {
    colors: extractColorsResult,
    fonts: extractFontsResult,
    spacers: extractSpacersResult,
    shadows: extractShadowsResult
  };
  expect(result).toEqual(expected);
  expect(figmaApiMock.getFile).toHaveBeenCalledWith("figma-id");
});
