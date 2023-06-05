import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import type {Node} from "figma-api/lib/ast-types";
import {isNodeType} from "figma-api/lib/ast-types";
import {
  isNodeWithChildren
} from "@src/loading/figma/extractors/figma-component-extractors/children/types/NodeWithChildren";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {Style, TEXT} from "figma-api";
import type {NodeWithFills, NodeWithStyles} from "@src/loading/figma/types/figma-api/NodeWithStyles";
import {hasFills, hasStyleMap} from "@src/loading/figma/types/figma-api/NodeWithStyles";
import {sortFields} from "@src/shared/stdlib/Objects";
import {buildPixelUnitConvertor} from "@src/loading/figma/utils/pixel-unit-convertor/PixelUnitConvertor";
import {typographyConfig} from "@src/config/providers/Config";
import type {
  PixelConversionFunction
} from "@src/loading/figma/utils/pixel-unit-convertor/types/PixelConversionFunction";

export type PartialDesignToken = Partial<Pick<DesignToken, "fonts" | "colors">>;

export function extractColorAndFont(figmaGetFileResult: GetFileResult): PartialDesignToken {
  const convertPixelValues = buildPixelUnitConvertor(typographyConfig());

  function extractStyles(previousValue: PartialDesignToken, node: Node): PartialDesignToken {
    if (isNodeWithChildren(node)) {
      for (const child of node.children) {
        previousValue = extractStyles(previousValue, child);
      }
    }

    if (hasStyleMap(node)) {
      previousValue = addStyles(previousValue, node, figmaGetFileResult, convertPixelValues);
    }

    return previousValue;
  }

  const designToken = figmaGetFileResult.document.children.reduce<PartialDesignToken>(extractStyles, {});
  if (designToken.colors) designToken.colors = sortFields(designToken.colors);
  if (designToken.fonts) designToken.fonts = sortFields(designToken.fonts);

  return designToken;
}

function addStyles(
  previousValue: Partial<DesignToken>,
  node: NodeWithStyles,
  figmaGetFileResult: GetFileResult,
  convertPixelValues: PixelConversionFunction
): Partial<DesignToken> {
  if (hasFills(node)) {
    previousValue = extractColorStyles(previousValue, node, figmaGetFileResult);
  }

  if (isNodeType(node, "TEXT") && node.styles.text) {
    previousValue = extractFontStyles(previousValue, node, figmaGetFileResult, convertPixelValues);
  }

  return previousValue;
}

function extractColorStyles(
  designToken: Partial<DesignToken>,
  node: NodeWithFills,
  figmaGetFileResult: GetFileResult
): Partial<DesignToken> {
  const fillStyleId = node.styles?.fill ?? node.styles?.fills;
  if (!fillStyleId) {
    return designToken;
  }

  const style = figmaGetFileResult.styles[fillStyleId];
  if (!style) {
    return designToken;
  }

  const fillColor = node.fills[0]?.color;
  if (!fillColor) {
    return designToken;
  }

  if (designToken.colors === undefined) {
    designToken.colors = {};
  }
  if (designToken.colors[style.name] !== undefined) {
    return designToken;
  }

  designToken.colors[style.name] = {
    type: "color",
    value: `rgba(${to8BitNumber(fillColor.r)}, ${to8BitNumber(fillColor.g)}, ${to8BitNumber(fillColor.b)}, ${to8BitNumber(fillColor.a)})`
  };
  return designToken;
}

const to8BitNumber = (input: number): number => Math.round(255 * input);

function extractFontStyles(
  designToken: Partial<DesignToken>,
  node: NodeWithStyles & TEXT,
  figmaGetFileResult: GetFileResult,
  convertPixelValues: PixelConversionFunction
): Partial<DesignToken> {
  const style = getTextStyle(figmaGetFileResult, node);

  if (designToken.fonts === undefined) {
    designToken.fonts = {};
  }
  if (designToken.fonts[style.name] !== undefined) return designToken;

  designToken.fonts[style.name] = {
    family: {
      value: node.style.fontPostScriptName ? `${node.style.fontFamily}, ${node.style.fontPostScriptName}` : node.style.fontFamily,
      type: "typography"
    },
    lineheight: {
      value: convertPixelValues(`${node.style.lineHeightPx}px`),
      type: "typography"
    },
    size: {
      value: convertPixelValues(`${node.style.fontSize}px`),
      type: "typography"
    },
    spacing: {
      value: convertPixelValues(`${node.style.letterSpacing}px`),
      type: "typography"
    },
    weight: {
      value: node.style.fontWeight,
      type: "typography"
    }
  };
  return designToken;
}

function getTextStyle(figmaGetFileResult: GetFileResult, node: NodeWithStyles): Style {
  const styleKeyToFind = node.styles?.text;
  if (!styleKeyToFind) {
    throw Error("Could not get text style as the style key provided is undefined");
  }

  const styleKey = Object.keys(figmaGetFileResult.styles).find((key) => {
    return key === styleKeyToFind;
  });
  if (!styleKey) throw Error("Could not find text style for font, has a style been generated on figma for this font?");

  return figmaGetFileResult.styles[styleKey];
}
