import * as target from "./ColorAndFontExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {NodeWithStyles, RealStylesMap} from "loading/figma/types/figma-api/NodeWithStyles";
import type {Node, Paint, TypeStyle} from "figma-api/lib/ast-types";
import type {PartialDesignToken} from "./ColorAndFontExtractor";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";
import {typographyConfig} from "@src/config/providers/Config";
import {buildPixelUnitConverter} from "@src/loading/figma/utils/spacers-unit-converter/SpacersUnitConverter";

jest.mock("@src/config/providers/Config");
jest.mock("@src/loading/figma/utils/spacers-unit-converter/SpacersUnitConverter");

const typographyConfigMock = mockFunction(typographyConfig);
const buildPixelUnitConverterMock = mockFunction(buildPixelUnitConverter);

const styles: GetFileResult["styles"] = {
  "fill1": {
    key: "not needed",
    name: "test1",
    styleType: "FILL",
    description: "none"
  },
  "fill2": {
    key: "not needed",
    name: "test2",
    styleType: "FILL",
    description: "none"
  },
  "text1": {
    key: "not needed",
    name: "test1",
    styleType: "TEXT",
    description: "none"
  },
  "text2": {
    key: "not needed",
    name: "test2",
    styleType: "TEXT",
    description: "none"
  }
};
const children: GetFileResult["document"]["children"] = [
  buildNode([
    buildNode([
      buildNode(
        {
          fill: "fill1"
        },
        [
          {
            color: {
              r: 0.25,
              g: 0.5,
              b: 0.75,
              a: 0.1
            }
          }
        ]
      ),
      buildNode(
        {
          fill: "fill2"
        },
        [
          {
            color: {
              r: 0.75,
              g: 0.5,
              b: 0.25,
              a: 0.9
            }
          }
        ]
      )
    ]),
    buildNode([
      buildNode(
        {
          text: "text1"
        },
        {
          fontPostScriptName: "text1-Bold",
          fontFamily: "text1",
          fontSize: 24,
          fontWeight: 400,
          letterSpacing: 20,
          lineHeightPx: 10
        }
      ),
      buildNode(
        {
          text: "text2"
        },
        {
          fontFamily: "text2",
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: 40,
          lineHeightPx: 20
        }
      )
    ])
  ])
];
const document: GetFileResult["document"] = {
  children
} as unknown as GetFileResult["document"];
const figmaGetFileResult: GetFileResult = {
  styles,
  document
} as unknown as GetFileResult;

beforeEach(() => {
  typographyConfigMock.mockReturnValue(undefined);
  buildPixelUnitConverterMock.mockReturnValue(input => input);
});

it("should generate design token", () => {
  const result = target.extractColorAndFont(figmaGetFileResult);

  expect(result).toEqual(<PartialDesignToken>{
    "colors": {
      "test1": {
        "type": "color",
        "value": "rgba(64, 128, 191, 26)"
      },
      "test2": {
        "type": "color",
        "value": "rgba(191, 128, 64, 230)"
      }
    },
    "fonts": {
      "test1": {
        "family": {
          "type": "typography",
          "value": "text1, text1-Bold"
        },
        "lineheight": {
          "type": "typography",
          "value": "10px"
        },
        "size": {
          "type": "typography",
          "value": "24px"
        },
        "spacing": {
          "type": "typography",
          "value": "20px"
        },
        "weight": {
          "type": "typography",
          "value": 400
        }
      },
      "test2": {
        "family": {
          "type": "typography",
          "value": "text2"
        },
        "lineheight": {
          "type": "typography",
          "value": "20px"
        },
        "size": {
          "type": "typography",
          "value": "48px"
        },
        "spacing": {
          "type": "typography",
          "value": "40px"
        },
        "weight": {
          "type": "typography",
          "value": 800
        }
      }
    }
  });
});

type SimplePaint = Pick<Paint, "color">;
type RealTypeStyle = Omit<TypeStyle, "fontPostScriptName"> & Partial<Pick<TypeStyle, "fontPostScriptName">>;
type SimpleTypeStyle = Pick<RealTypeStyle, "fontPostScriptName" | "fontFamily" | "lineHeightPx" | "fontSize" | "letterSpacing" | "fontWeight">;

function buildNode(styles: RealStylesMap, textStyle?: SimpleTypeStyle): Node;
function buildNode(styles: RealStylesMap, fills?: SimplePaint[]): Node;
function buildNode(children: Node[]): Node;
function buildNode(stylesOrChildren?: RealStylesMap | Node[], fillsOrTextStyle?: (SimplePaint[] | SimpleTypeStyle)): Node {
  if (Array.isArray(stylesOrChildren)) {
    return {
      type: "FRAME",
      children: stylesOrChildren
    } as unknown as Node;
  }

  if (Array.isArray(fillsOrTextStyle)) {
    const nodeWithStyles = {
      type: "RECTANGLE",
      styles: stylesOrChildren,
      fills: fillsOrTextStyle
    } as unknown as NodeWithStyles;

    return nodeWithStyles as unknown as Node;
  }

  const nodeWithStyles = {
    type: "TEXT",
    styles: stylesOrChildren,
    style: fillsOrTextStyle
  } as unknown as NodeWithStyles;

  return nodeWithStyles as unknown as Node;
}