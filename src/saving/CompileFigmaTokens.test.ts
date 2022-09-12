import * as target from "./CompileFigmaTokens";
import type {DesignToken} from "@src/loading/figma/types/design-token/DesignToken";
import {existsSync, mkdirSync, rmSync, writeFileSync} from "fs";
import {StyleDictionary} from "./providers/StyleDictionary";
import {buildTemporaryStyleDictionaryDirectory} from "./utils/StyleDictionaryDirectory";
import type {Config} from "style-dictionary";
import {castMockObject, mockFunction} from "@src/shared/testing/jest/JestHelpers";
import {outputFolder} from "@src/config/providers/Config";

jest.mock("fs");
jest.mock("./providers/StyleDictionary");
jest.mock("@src/config/providers/Config");
jest.mock("./utils/StyleDictionaryDirectory");

const existsSyncMock = mockFunction(existsSync);
const writeFileSyncMock = mockFunction(writeFileSync);
const outputFolderMock = mockFunction(outputFolder);
const buildTemporaryStyleDictionaryDirectoryMock = mockFunction(buildTemporaryStyleDictionaryDirectory);
const mkdirSyncMock = mockFunction(mkdirSync);
const rmSyncMock = mockFunction(rmSync);
const StyleDictionaryMock = castMockObject(StyleDictionary);

const tokens: DesignToken = {
  colors: {},
  fonts: {},
  shadows: {},
  spacers: {}
};

beforeEach(() => {
  StyleDictionaryMock.extend.mockReturnValue(StyleDictionaryMock);
  outputFolderMock.mockReturnValue("test-directory");
  buildTemporaryStyleDictionaryDirectoryMock.mockReturnValue("test-temporary-directory");
});

describe("when tokens are complied with an existing token directory", () => {
  beforeEach(() => {
    existsSyncMock.mockReturnValue(true);

    target.compileFigmaTokens(tokens);
  });

  it("should write json file to temporary directory", () => {
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      "test-temporary-directory/token.json",
      "{\"colors\":{},\"fonts\":{},\"shadows\":{},\"spacers\":{}}"
    );
  });

  it("should configure style dictionary", () => {
    expect(StyleDictionaryMock.extend).toHaveBeenCalledWith(expectedConfig);
  });

  it("should build style dictionary outputs", () => {
    expect(StyleDictionaryMock.buildAllPlatforms).toHaveBeenCalled();
  });

  it("should not make any directories", () => {
    expect(mkdirSyncMock).not.toHaveBeenCalled();
  });

  it("should delete the style-directory temporary directory", () => {
    expect(rmSyncMock).toHaveBeenCalledWith("test-temporary-directory", {recursive: true});
  });
});

describe("when tokens are complied without an existing token directory", () => {
  beforeEach(() => {
    existsSyncMock.mockReturnValue(false);

    target.compileFigmaTokens(tokens);
  });

  it("should write json file to temporary directory", () => {
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      "test-temporary-directory/token.json",
      "{\"colors\":{},\"fonts\":{},\"shadows\":{},\"spacers\":{}}"
    );
  });

  it("should configure style dictionary", () => {
    expect(StyleDictionaryMock.extend).toHaveBeenCalledWith(expectedConfig);
  });

  it("should build style dictionary outputs", () => {
    expect(StyleDictionaryMock.buildAllPlatforms).toHaveBeenCalled();
  });

  it("should make the temporary directory", () => {
    expect(mkdirSyncMock).toHaveBeenCalledWith("test-temporary-directory");
  });

  it("should delete the style-directory temporary directory", () => {
    expect(rmSyncMock).toHaveBeenCalledWith("test-temporary-directory", {recursive: true});
  });
});

const expectedConfig: Config = {
  source: ["style-dictionary-source/**/*.json"],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "test-directory/scss/",
      options: {
        showFileHeader: false,
        outputReferences: false
      },
      files: [
        {
          destination: "_colors.scss",
          format: "scss/map-deep",
          filter: {
            type: "color"
          }
        },
        {
          destination: "_typography.scss",
          format: "scss/map-deep",
          filter: {
            type: "typography"
          }
        },
        {
          destination: "_shadows.scss",
          format: "scss/variables",
          filter: {
            type: "shadows"
          }
        },
        {
          destination: "_spacers.scss",
          format: "scss/variables",
          filter: {
            type: "spacers"
          }
        }
      ]
    }
  }
};
