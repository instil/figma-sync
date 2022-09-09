import type {GetFileResult} from "figma-api/lib/api-types";
import type {FRAME} from "figma-api";
import {isInstance} from "@src/loading/figma/types/figma-api/Instance";
import {extractFrame} from "./figma-component-extractors/FrameExtractor";
import type {DesignTokenFonts} from "@src/loading/figma/types/design-token/types/DesignTokenFonts";
import {isText} from "@src/loading/figma/types/figma-api/Text";
import {findChild} from "./figma-component-extractors/children/ChildFinder";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import {filterChildren} from "./figma-component-extractors/children/ChildFilter";
import {logPercentage} from "./logging/PercentageLogger";
import type {Node} from "figma-api/lib/ast-types";

const pageName = "   ↳ Typography";
const frameName = "Typography";

export function extractFonts(figmaGetFileResult: GetFileResult): DesignTokenFonts {
  console.log("Extracting fonts...");

  const containerFrame = extractFrame({figmaGetFileResult, pageName, frameName});

  const fontFrames = filterChildren<FRAME & Node>(containerFrame, maybeFontFrame => isFrame(maybeFontFrame));
  if (fontFrames.length === 0) throw Error("No fonts found, is figma setup correctly?");

  const fonts = fontFrames.map(fontFrame => {
    console.log(`Extracting ${fontFrame.name} fonts...`);
    const fonts = extractFrontsFromFrame(fontFrame);
    console.log("Desktop font extraction complete!");
    return fonts;
  });

  console.log("Font extraction complete!\n");
  return fonts.reduce((designToken, font) => ({
    ...designToken,
    ...font
  }), {});
}

function extractFrontsFromFrame(frame: FRAME & Node): DesignTokenFonts {
  const stackItems = filterChildren(frame, isInstance);
  if (stackItems.length === 0) return {};

  const designTokens: DesignTokenFonts = {};
  stackItems.forEach((stackItem, index) => {
    logPercentage({
      type: "fonts",
      index,
      length: stackItems.length
    });

    const stackItemChildrenContainer = findChild<FRAME>(stackItem, isFrame);
    if (!stackItemChildrenContainer) throw Error("No stack item children container found for type stack, is figma setup correctly?");

    const sampleContainer = findChild<FRAME>(stackItemChildrenContainer, maybeSampleContainer => isFrame(maybeSampleContainer) && maybeSampleContainer.name === "Sample");
    if (!sampleContainer) throw Error("No sample container found for type stack, is figma setup correctly?");

    sampleContainer.children.forEach(fontSpec => {
      if (!isText(fontSpec)) throw Error("Font node was not of type text, is figma setup correctly?");

      const name = fontSpec.characters;
      const type = fontSpec.name;
      designTokens[`${name} / ${frame.name} / ${type}`] = {
        family: {
          value: fontSpec.style.fontPostScriptName ? `${fontSpec.style.fontFamily}, ${fontSpec.style.fontPostScriptName}` : fontSpec.style.fontFamily,
          type: "typography"
        },
        lineheight: {
          value: `${fontSpec.style.lineHeightPx}px`,
          type: "typography"
        },
        size: {
          value: `${fontSpec.style.fontSize}px`,
          type: "typography"
        },
        spacing: {
          value: `${fontSpec.style.letterSpacing}px`,
          type: "typography"
        },
        weight: {
          value: fontSpec.style.fontWeight,
          type: "typography"
        }
      };
    });
  });
  return designTokens;
}
