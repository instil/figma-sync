import type {GetFileResult} from "figma-api/lib/api-types";
import type {FRAME} from "figma-api";
import {isInstance} from "@src/loading/figma/types/figma-api/Instance";
import {extractFrame} from "./utils/FrameExtractor";
import type {DesignTokenFonts} from "@src/loading/figma/types/design-token/types/DesignTokenFonts";
import {isText} from "@src/loading/figma/types/figma-api/Text";
import {findChild} from "./utils/children/ChildFinder";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import {filterChildren} from "./utils/children/ChildFilter";
import {logPercentage} from "./utils/PercentageLogger";

const pageName = "   ↳ Typography";
const frameName = "Typography";

export function extractFonts(figmaGetFileResult: GetFileResult): DesignTokenFonts {
  console.log("Extracting fonts...");

  const fontFrame = extractFrame({figmaGetFileResult, pageName, frameName});

  const desktopFrame = findChild<FRAME>(fontFrame, maybeFontFrame => isFrame(maybeFontFrame) && maybeFontFrame.name === "Desktop Type Stack");
  if (!desktopFrame) throw Error("No desktop typography found, is figma setup correctly?");

  console.log("Extracting desktop fonts...");
  const desktopFonts = extractFrontsFromFrame(desktopFrame);
  console.log("Desktop font extraction complete!");

  const mobileFrame = findChild<FRAME>(fontFrame, maybeFontFrame => isFrame(maybeFontFrame) && maybeFontFrame.name === "Mobile Type Stack");
  if (!mobileFrame) throw Error("No mobile typography found, is figma setup correctly?");
  console.log("Extracting mobile fonts...");
  const mobileFonts = extractFrontsFromFrame(mobileFrame);
  console.log("Mobile font extraction complete!");

  console.log("Font extraction complete!\n");
  return {
    ...desktopFonts,
    ...mobileFonts
  };
}

function extractFrontsFromFrame(frame: FRAME): DesignTokenFonts {
  const stackItems = filterChildren(frame, isInstance);
  if (stackItems.length === 0) return {};

  const headerFrame = findChild(frame, isFrame);
  if (!headerFrame) throw Error("Could not find header frame that contains the environment type (e.g. 'Desktop' or 'Mobile')");
  const headerTextFrame = findChild(headerFrame, isText);
  if (!headerTextFrame) throw Error("Could not find text inside header frame that contains the environment type (e.g. 'Desktop' or 'Mobile')");

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
      const environment = headerTextFrame.characters;
      const type = fontSpec.name;
      designTokens[`${name}/${environment} ${type}`] = {
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
