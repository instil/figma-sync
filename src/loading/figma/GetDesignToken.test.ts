import * as target from "./GetDesignToken";
import type {DesignToken} from "./types/design-token/DesignToken";
import type {DesignTokenSpacers} from "./types/design-token/types/DesignTokenSpacers";
import type {GetFileResult} from "figma-api/lib/api-types";
import {figmaApi} from "./providers/FigmaApi";
import type {PartialDesignToken} from "./extractors/ColorAndFontExtractor";
import {extractColorAndFont} from "./extractors/ColorAndFontExtractor";
import {extractSpacers} from "./extractors/SpacerExtractor";
import {extractShadows} from "./extractors/ShadowExtractor";
import type {Api as FigmaApi} from "figma-api/lib/api-class";
import {figmaId} from "@src/config/providers/Config";
import {createMockObjectOf, mockFunction} from "@src/shared/testing/jest/JestHelpers";
import type {DesignTokenShadows} from "./types/design-token/types/DesignTokenShadows";

jest.mock("./providers/FigmaApi");
jest.mock("./extractors/ColorAndFontExtractor");
jest.mock("./extractors/SpacerExtractor");
jest.mock("./extractors/ShadowExtractor");
jest.mock("@src/config/providers/Config");

const figmaApiBuilderMock = mockFunction(figmaApi);
const figmaApiMock = createMockObjectOf<FigmaApi>("getFile");
const extractColorAndFontMock = mockFunction(extractColorAndFont);
const extractSpacersMock = mockFunction(extractSpacers);
const extractShadowsMock = mockFunction(extractShadows);
const figmaIdMock = mockFunction(figmaId);

const getFileResult: GetFileResult = {} as unknown as GetFileResult;
const extractColorAndFontsResult: PartialDesignToken = {
  colors: {},
  fonts: {}
} as unknown as PartialDesignToken;
const extractSpacersResult: DesignTokenSpacers = {} as unknown as DesignTokenSpacers;
const extractShadowsResult: DesignTokenShadows = {} as unknown as DesignTokenShadows;

beforeEach(() => {
  figmaApiBuilderMock.mockReturnValue(figmaApiMock);
  figmaApiMock.getFile.mockResolvedValue(getFileResult);
  extractColorAndFontMock.mockReturnValue(extractColorAndFontsResult);
  extractSpacersMock.mockReturnValue(extractSpacersResult);
  extractShadowsMock.mockReturnValue(extractShadowsResult);
  figmaIdMock.mockReturnValue("figma-id");
});

it("should create design token from figma file", async () => {
  const result = await target.getDesignToken();

  const expected: DesignToken = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    colors: extractColorAndFontsResult.colors!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fonts: extractColorAndFontsResult.fonts!,
    spacers: extractSpacersResult,
    shadows: extractShadowsResult
  };
  expect(result).toEqual(expected);
  expect(figmaApiMock.getFile).toHaveBeenCalledWith("figma-id");
});
