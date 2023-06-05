import * as target from "./GetDesignToken";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {PartialDesignToken} from "./extractors/ColorAndFontExtractor";
import {extractColorAndFont} from "./extractors/ColorAndFontExtractor";

jest.mock("./extractors/ColorAndFontExtractor");

const extractColorAndFontMock = jest.mocked(extractColorAndFont);

const getFileResult: GetFileResult = {} as unknown as GetFileResult;
const extractColorAndFontsResult: PartialDesignToken = {
  colors: {},
  fonts: {}
} as unknown as PartialDesignToken;

beforeEach(() => {
  extractColorAndFontMock.mockReturnValue(extractColorAndFontsResult);
});

it("should create design token from figma file", async () => {
  const result = await target.getDesignToken(getFileResult);

  const expected: DesignToken = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    colors: extractColorAndFontsResult.colors!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fonts: extractColorAndFontsResult.fonts!
  };
  expect(result).toEqual(expected);
});
