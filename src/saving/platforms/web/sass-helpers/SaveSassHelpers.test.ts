import * as target from "./SaveSassHelpers";
import {existsSync, readFileSync, writeFileSync} from "fs";
import {outputFolder} from "@src/config/providers/Config";

jest.mock("fs");
jest.mock("@src/config/providers/Config");

const readFileSyncMock = jest.mocked(readFileSync);
const writeFileSyncMock = jest.mocked(writeFileSync);
const existsSyncMock = jest.mocked(existsSync);
const outputFolderMock = jest.mocked(outputFolder);

beforeEach(() => {
  existsSyncMock.mockReturnValue(true);
  readFileSyncMock.mockReturnValue("A file");

  outputFolderMock.mockReturnValue("generated");
});

describe("when executing via ts-node", () => {
  beforeEach(() => {
    existsSyncMock.mockReturnValue(true);
  });

  it("should save helper files when exists locally", () => {
    target.saveSassHelpers();

    expect(writeFileSyncMock).toHaveBeenCalledWith("generated/scss/TypographyHelpers.scss", "A file");
    expect(writeFileSyncMock).toHaveBeenCalledWith("generated/scss/ColorHelpers.scss", "A file");
    expect(writeFileSyncMock).toHaveBeenCalledWith("generated/scss/SpacerHelpers.scss", "A file");
  });

  it("should throw error if helpers folder does not exist", () => {
    existsSyncMock.mockReturnValue(false);

    expect(() => target.saveSassHelpers()).toThrow("Could not find sass helpers folder");

    expect(readFileSyncMock).not.toHaveBeenCalled();
    expect(writeFileSyncMock).not.toHaveBeenCalled();
  });
});

describe("when executing via build folder", () => {
  beforeEach(() => {
    existsSyncMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
  });

  it("should save helper files when exists locally", () => {
    target.saveSassHelpers();

    expect(writeFileSyncMock).toHaveBeenCalledWith("generated/scss/TypographyHelpers.scss", "A file");
    expect(writeFileSyncMock).toHaveBeenCalledWith("generated/scss/ColorHelpers.scss", "A file");
    expect(writeFileSyncMock).toHaveBeenCalledWith("generated/scss/SpacerHelpers.scss", "A file");
  });

  it("should throw error if helpers folder does not exist", () => {
    existsSyncMock.mockReset().mockReturnValue(false);

    expect(() => target.saveSassHelpers()).toThrow("Could not find sass helpers folder");

    expect(readFileSyncMock).not.toHaveBeenCalled();
    expect(writeFileSyncMock).not.toHaveBeenCalled();
  });
});
