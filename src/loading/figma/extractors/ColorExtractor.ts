import type {GetFileResult} from "figma-api/lib/api-types";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import {isInstance} from "@src/loading/figma/types/figma-api/Instance";
import {isRectangle} from "@src/loading/figma/types/figma-api/Rectangle";
import type {DesignTokenColors} from "@src/loading/figma/types/design-token/types/DesignTokenColors";
import {extractFrame} from "./utils/FrameExtractor";
import {findChild} from "./utils/children/ChildFinder";
import {filterChildren} from "./utils/children/ChildFilter";
import type {COMPONENT, INSTANCE} from "figma-api";
import {isComponent} from "@src/loading/figma/types/figma-api/Component";
import {logPercentage} from "./utils/PercentageLogger";

const pageName = "   ↳ Colour";
const frameName = "System";

export function extractColors(figmaGetFileResult: GetFileResult): DesignTokenColors {
  console.log("Extracting colors...");

  const paletteFrame = extractFrame({figmaGetFileResult, pageName, frameName});

  const swatchRows = filterChildren(paletteFrame, isFrame);

  const designTokens: DesignTokenColors = {};
  swatchRows.forEach((swatchRow, index) => {
    logPercentage({
      type: "styles",
      index,
      length: swatchRows.length
    });

    const rectangleContainers = filterChildren<INSTANCE | COMPONENT>(swatchRow, (maybeRectangleContainer) => isInstance(maybeRectangleContainer) || isComponent(maybeRectangleContainer));

    rectangleContainers.forEach(rectangleContainer => {
      const colorRectangle = findChild(rectangleContainer, isRectangle);
      if (!colorRectangle) throw Error("Could not find 'RECTANGLE' containing color information, is figma setup correctly?");

      // Ignoring this as the type definition is wrong...
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const fillStyleId = colorRectangle.styles?.fill;
      if (!fillStyleId) throw Error("Did not have fill style on color rectangle, is figma setup correctly?");

      const style = figmaGetFileResult.styles[fillStyleId];
      if (!style) throw Error(`Style with id of '${fillStyleId}' was not found, is figma setup correctly?`);

      const fillColor = colorRectangle.fills[0]?.color;
      if (!fillColor) throw Error(`No fill color details found on color '${style.name}', is figma setup correctly?`);

      designTokens[style.name] = {
        type: "color",
        value: `rgba(${to8BitNumber(fillColor.r)}, ${to8BitNumber(fillColor.g)}, ${to8BitNumber(fillColor.b)}, ${to8BitNumber(fillColor.a)})`
      };
    });
  });

  console.log("Style extraction complete!\n");
  return designTokens;
}

const to8BitNumber = (input: number): number => Math.round(255 * input);
