import * as target from "./SaveIosStyleDictionary";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {existsSync, mkdirSync, rmSync, writeFileSync} from "fs";
import {StyleDictionary} from "@src/saving/providers/StyleDictionary";
import {buildTemporaryStyleDictionaryDirectory} from "@src/saving/platforms/shared/providers/StyleDictionaryDirectory";
import type {Config} from "style-dictionary";
import {castMockObject} from "@src/shared/testing/jest/JestHelpers";
import {outputFolder} from "@src/config/providers/Config";

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

    target.saveIosStyleDictionary(tokens);
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

    target.saveIosStyleDictionary(tokens);
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

const expectedConfig: Config = {
  source: ["style-dictionary-source/**/*.json"],
  transform: {
    colorNameTransform: {
      matcher: expect.anything(),
      transformer: expect.anything(),
      type: "name"
    },
    colorValueTransform: {
      matcher: expect.anything(),
      transformer: expect.anything(),
      transitive: true,
      type: "value"
    },
    fontTransform: {
      matcher: expect.anything(),
      transformer: expect.anything(),
      type: "name"
    },
    fontValueTransform: {
      matcher: expect.anything(),
      transformer: expect.anything(),
      transitive: true,
      type: "value"
    }
  },
  platforms: {
    ios: {
      transformGroup: "ios",
      transforms: [
        "colorNameTransform",
        "colorValueTransform",
        "fontTransform",
        "fontValueTransform"
      ],
      buildPath: "test-directory/ios/",
      options: {
        showFileHeader: false,
        outputReferences: false
      },
      files: [
        {
          destination: "_colors.swift",
          format: "ios-swift/class.swift",
          filter: {
            type: "color"
          }
        },
        {
          destination: "_typography.swift",
          format: "ios-swift/class.swift",
          filter: {
            type: "typography"
          }
        }
      ]
    }
  }
};
