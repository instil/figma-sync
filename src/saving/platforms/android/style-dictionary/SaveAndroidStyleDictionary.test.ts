import * as target from "./SaveAndroidStyleDictionary";
import {writeFileSync} from "fs";
import {outputFolder} from "@src/config/providers/Config";
import {removeWhitespace} from "@src/shared/stdlib/Strings";

jest.mock("@src/config/providers/Config");
jest.mock("fs");

const outputFolderMock = jest.mocked(outputFolder);
const writeFileSyncMock = jest.mocked(writeFileSync);

beforeEach(() => {
  outputFolderMock.mockReturnValue("generated");
});

it("should inject design tokens into kotlin file", () => {
  target.saveAndroidStyleDictionary({
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
  const [filePath, file] = writeFileSyncMock.mock.calls[0];

  expect(filePath).toBe("generated/android/FigmaTokens.kt");
  if (typeof file !== "string") throw new Error("Expected a string to be passed to writeFileSync");
  expect(removeWhitespace(file)).toEqual(removeWhitespace(`
    package co.instil.figmasync;
    
    import androidx.compose.ui.text.TextStyle
    import androidx.compose.ui.text.font.FontFamily
    import androidx.compose.ui.text.font.FontWeight
    import androidx.compose.ui.unit.TextUnit
    import androidx.compose.ui.unit.sp
    import androidx.compose.ui.graphics.Color

    val PrimaryLight10 = Color(255, 0, 0, 1)
    val SecondaryLight20 = Color(0, 255, 0, 1)

    val Desktop2XLRegularSize: TextUnit = 24.sp
    val Desktop2XLRegularWeight: FontWeight = FontWeight.W700
    val Desktop2XLRegularLineHeight: TextUnit = 24.sp
    fun Desktop2XLRegular(fontFamily: FontFamily) = TextStyle(
        fontFamily = fontFamily,
        fontSize = Desktop2XLRegularSize,
        fontWeight = Desktop2XLRegularWeight,
        lineHeight = Desktop2XLRegularLineHeight
    )
  `));
});
