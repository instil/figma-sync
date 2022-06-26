import * as target from "./SaveIcons";
import type {SvgDictionary} from "@src/loading/figma/types/design-token/SvgDictionary";
import {mkdirSync, writeFileSync} from "fs";
import {logPercentage} from "@src/loading/figma/extractors/utils/PercentageLogger";
import {iconBuildFolder} from "./utils/IconsDirectory";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";

jest.mock("fs");
jest.mock("@src/loading/figma/extractors/utils/PercentageLogger");
jest.mock("./utils/IconsDirectory");

const mkdirSyncMock = mockFunction(mkdirSync);
const writeFileSyncMock = mockFunction(writeFileSync);
const logPercentageMock = mockFunction(logPercentage);
const iconBuildFolderMock = mockFunction(iconBuildFolder);

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
