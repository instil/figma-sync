import * as target from "./SaveIcons";
import type {SvgDictionary} from "@src/shared/types/design-token/SvgDictionary";
import {mkdirSync, writeFileSync} from "fs";
import {logPercentage} from "@src/shared/logging/PercentageLogger";
import {iconBuildFolder} from "./providers/IconsDirectory";

jest.mock("fs");
jest.mock("@src/shared/logging/PercentageLogger");
jest.mock("./providers/IconsDirectory");

const mkdirSyncMock = jest.mocked(mkdirSync);
const writeFileSyncMock = jest.mocked(writeFileSync);
const logPercentageMock = jest.mocked(logPercentage);
const iconBuildFolderMock = jest.mocked(iconBuildFolder);

const icons: SvgDictionary = {
  svg1: "svg1-content",
  svg2: "svg2-content"
};

beforeEach(() => {
  iconBuildFolderMock.mockReturnValue("test-directory");
});

describe("when saving icons", () => {
  beforeEach(() => {
    target.saveIcons(icons);
  });

  it("should make the directory for the icons", () => {
    expect(mkdirSyncMock).toHaveBeenCalledWith("test-directory", {recursive: true});
  });

  it("should write each file to directory", () => {
    expect(writeFileSyncMock).toHaveBeenCalledWith("test-directory/svg1.svg", "svg1-content");
    expect(writeFileSyncMock).toHaveBeenCalledWith("test-directory/svg2.svg", "svg2-content");
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2
    });
  });
});
