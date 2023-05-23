import * as target from "./GetFigmaFile";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {GetFileResult} from "figma-api/lib/api-types";
import {extractFile} from "./extractors/FileExtractor";

jest.mock("./extractors/FileExtractor");

const extractFileMock = jest.mocked(extractFile);

const figmaFileStub: GetFileResult = "get file result stub" as unknown as GetFileResult;

beforeEach(() => {
  extractFileMock.mockResolvedValue(figmaFileStub);
});

it("should return figma file", async () => {
  expect(await target.getFigmaFile()).toEqual(figmaFileStub);
});