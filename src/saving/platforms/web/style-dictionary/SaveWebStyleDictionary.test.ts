import * as target from "./SaveWebStyleDictionary";
import {existsSync, mkdirSync, rmSync, writeFileSync} from "fs";
import type {Config} from "style-dictionary";
import {colorsConfig, outputFolder} from "@src/config/providers/Config";
import {buildTemporaryStyleDictionaryDirectory} from "@src/saving/platforms/shared/providers/StyleDictionaryDirectory";
import {castMockObject} from "@src/shared/testing/jest/JestHelpers";
import {StyleDictionary} from "@src/saving/providers/StyleDictionary";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";

jest.mock("fs");
jest.mock("@src/saving/providers/StyleDictionary");
jest.mock("@src/config/providers/Config");
jest.mock("@src/saving/platforms/shared/providers/StyleDictionaryDirectory");

const existsSyncMock = jest.mocked(existsSync);
const writeFileSyncMock = jest.mocked(writeFileSync);
const outputFolderMock = jest.mocked(outputFolder);
const buildTemporaryStyleDictionaryDirectoryMock = jest.mocked(buildTemporaryStyleDictionaryDirectory);
const mkdirSyncMock = jest.mocked(mkdirSync);
const rmSyncMock = jest.mocked(rmSync);
const StyleDictionaryMock = castMockObject(StyleDictionary);
const colorsConfigMock = jest.mocked(colorsConfig);

const tokens: DesignToken = {
  colors: {},
  fonts: {}
};

beforeEach(() => {
  StyleDictionaryMock.extend.mockReturnValue(StyleDictionaryMock);
  outputFolderMock.mockReturnValue("test-directory");
  buildTemporaryStyleDictionaryDirectoryMock.mockReturnValue("test-temporary-directory");
});

describe("when tokens are complied with an existing token directory", () => {
  beforeEach(() => {
    existsSyncMock.mockReturnValue(true);

    target.saveWebStyleDictionary(tokens);
  });

  it("should write json file to temporary directory", () => {
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      "test-temporary-directory/token.json",
      "{\"colors\":{},\"fonts\":{}}"
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

    target.saveWebStyleDictionary(tokens);
  });

  it("should write json file to temporary directory", () => {
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      "test-temporary-directory/token.json",
      "{\"colors\":{},\"fonts\":{}}"
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

describe("when include css variables configuration option exists", () => {
  beforeEach(() => {
    colorsConfigMock.mockReturnValue({
      includeCssVariables: true
    });

    target.saveWebStyleDictionary(tokens);
  });

  it("should configure style dictionary with css variables file", () => {
    expect(StyleDictionaryMock.extend).toHaveBeenCalledWith(<Config>{
      ...expectedConfig,
      platforms: {
        ...expectedConfig.platforms,
        scss: {
          ...expectedConfig.platforms.scss,
          files: [
            ...(expectedConfig.platforms.scss.files ?? []),
            {
              destination: "_colors.variables.css",
              format: "css/variables",
              filter: {
                type: "color"
              }
            }
          ]
        }
      }
    });
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
        }
      ]
    }
  }
};
