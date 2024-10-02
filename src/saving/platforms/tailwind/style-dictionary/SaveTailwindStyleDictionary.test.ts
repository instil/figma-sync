import * as target from "./SaveTailwindStyleDictionary";
import {mkdirSync, writeFileSync} from "fs";
import {outputFolder} from "@src/config/providers/Config";
import {removeWhitespace} from "@src/shared/stdlib/Strings";

jest.mock("@src/config/providers/Config");
jest.mock("fs");

const outputFolderMock = jest.mocked(outputFolder);
const mkdirSyncMock = jest.mocked(mkdirSync);
const writeFileSyncMock = jest.mocked(writeFileSync);

beforeEach(() => {
  outputFolderMock.mockReturnValue("generated");
});

it("should generate color and typography files", () => {
  target.saveTailwindStyleDictionary({
    colors: {
      "Primary/Light/10": {
        value: "rgba(255, 0, 0, 1)",
        type: "color"
      },
      "Secondary/Light/20": {
        value: "rgba(0, 255, 0, 1)",
        type: "color"
      }
    },
    fonts: {
      "Desktop/2XL/Regular": {
        family: {
          value: "comic sans",
          type: "typography"
        },
        weight: {
          value: 700,
          type: "typography"
        },
        size: {
          value: "24px",
          type: "typography"
        },
        lineheight: {
          value: "10px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      }
    }
  });

  expect(mkdirSyncMock).toHaveBeenCalledWith("generated/tailwind/", {recursive: true});
  const [colourFilePath, colourFile] = writeFileSyncMock.mock.calls[0];
  const [typographyFilePath, typographyFile] = writeFileSyncMock.mock.calls[1];
  if (typeof colourFile !== "string") throw new Error("Expected colour file to be a string");
  if (typeof typographyFile !== "string") throw new Error("Expected typography file to be a string");
  expect(colourFilePath).toBe("generated/tailwind/_colors.ts");
  expect(typographyFilePath).toBe("generated/tailwind/_typography.css");
  expect(removeWhitespace(colourFile)).toBe(removeWhitespace(`
    export default {
      PrimaryLight10: {DEFAULT: "rgba(255, 0, 0, 1)"},
      SecondaryLight20: {DEFAULT: "rgba(0, 255, 0, 1)"},
    }
  `));
  expect(removeWhitespace(typographyFile)).toBe(removeWhitespace(`
    @tailwind base;

    @layerbase {
      .font-Desktop2XLRegular {
        font-family: comicsans;
        line-height: 10px;
        font-size: 24px;
        letter-spacing: 0px;
        font-weight: 700;
      }
    }
  `));
});
