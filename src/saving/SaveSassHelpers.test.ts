import * as target from "./SaveSassHelpers";
import {readFileSync, writeFileSync, existsSync} from "fs";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";
import {outputFolder} from "@src/config/providers/Config";

jest.mock("fs");
jest.mock("@src/config/providers/Config");

const readFileSyncMock = mockFunction(readFileSync);
const writeFileSyncMock = mockFunction(writeFileSync);
const existsSyncMock = mockFunction(existsSync);
const outputFolderMock = mockFunction(outputFolder);

beforeEach(() => {
  existsSyncMock.mockReturnValue(true);
  readFileSyncMock.mockReturnValue("A file");

  outputFolderMock.mockReturnValue("generated");
});

it("should save typography helper file when exists locally", () => {
  target.saveSassHelpers();

  expect(writeFileSyncMock).toHaveBeenCalledWith("generated/scss/TypographyHelpers.scss", "A file");
});

it("should throw error if typography helper file does not exist", () => {
  existsSyncMock.mockReturnValue(false);

  expect(() => target.saveSassHelpers()).toThrow(new Error("Could not find typography helper file"));

  expect(readFileSyncMock).not.toHaveBeenCalled();
  expect(writeFileSyncMock).not.toHaveBeenCalled();
});
