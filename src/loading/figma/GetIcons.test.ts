import * as target from "./GetIcons";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {SvgDictionary} from "@src/shared/types/design-token/SvgDictionary";
import {extractIcons} from "./extractors/IconExtractor";

jest.mock("./extractors/IconExtractor");

const extractIconsMock = jest.mocked(extractIcons);

const getFileResult: GetFileResult = {} as unknown as GetFileResult;
const extractIconsResult: SvgDictionary = {} as unknown as SvgDictionary;

beforeEach(() => {
  extractIconsMock.mockResolvedValue(extractIconsResult);
});

it("should get figma file and then try to extract icons from it", async () => {
  const result = await target.getIcons(getFileResult);

  expect(result).toEqual(extractIconsResult);
  expect(extractIconsMock).toHaveBeenCalledWith(getFileResult);
});
