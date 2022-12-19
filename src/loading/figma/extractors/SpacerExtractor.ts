import type {GetFileResult} from "figma-api/lib/api-types";
import {extractFrame} from "./figma-component-extractors/FrameExtractor";
import {isText} from "@src/loading/figma/types/figma-api/Text";
import type {DesignTokenSpacers} from "@src/loading/figma/types/design-token/types/DesignTokenSpacers";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import {findChild} from "./figma-component-extractors/children/ChildFinder";
import {filterChildren} from "./figma-component-extractors/children/ChildFilter";
import {logPercentage} from "./logging/PercentageLogger";
import {buildPixelUnitConvertor} from "@src/loading/figma/utils/pixel-unit-convertor/PixelUnitConvertor";
import {spacersConfig} from "@src/config/providers/Config";
import type {PixelUnitType} from "@src/shared/types/UnitType";

const pageName = "   ↳ Spacing";
const frameName = "Table";

export function extractSpacers(figmaGetFileResult: GetFileResult): DesignTokenSpacers {
  console.log("Extracting spacers...");

  const spaceFrame = extractFrame({figmaGetFileResult, pageName, frameName});
  if (!spaceFrame) {
    console.warn(`When trying to extract spacers could not find frame called '${frameName}' on page '${pageName}', is figma setup correctly?`);
    return {};
  }

  const nameContainer = spaceFrame.children[0];
  if (!isFrame(nameContainer)) throw Error("Spacing did not contain name container, is figma setup correctly?");
  const nameNodes = filterChildren<"FRAME">(nameContainer, maybeNameNode => isFrame(maybeNameNode) && maybeNameNode.name === "Documentation/Cell");

  const pixelValueContainer = spaceFrame.children[2];
  if (!isFrame(pixelValueContainer)) throw Error("Spacing did not contain pixel value container, is figma setup correctly?");
  const pixelValueNodes = filterChildren<"FRAME">(pixelValueContainer, maybePixelValueNode => isFrame(maybePixelValueNode) && maybePixelValueNode.name === "Documentation/Cell");

  if (nameNodes.length !== pixelValueNodes.length) throw Error("Spacing page's number of spacing names do not match the number of pixel values, is figma setup correctly?");

  const spacersUnitConverter = buildPixelUnitConvertor(spacersConfig());

  const designTokens: DesignTokenSpacers = {};
  nameNodes.forEach((nameNode, index) => {
    logPercentage({
      type: "spacers",
      index,
      length: nameNodes.length
    });

    const nameContentNode = findChild(nameNode, isFrame);
    if (!nameContentNode) throw Error("A spacing page's name node did not contain text container node, is figma setup correctly?");

    const nameTextNode = findChild(nameContentNode, isText);
    if (!nameTextNode) throw Error("A spacing page's name node did not contain text node, is figma setup correctly?");

    const pixelContentNode = findChild(pixelValueNodes[index], isFrame);
    if (!pixelContentNode) throw Error("A spacing page's pixel node did not contain text container node, is figma setup correctly?");

    const pixelTextNode = findChild(pixelContentNode, isText);
    if (!pixelTextNode) throw Error("A spacing page's pixel node did not contain text node, is figma setup correctly?");

    designTokens[nameTextNode.characters] = {
      value: spacersUnitConverter(pixelTextNode.characters as PixelUnitType),
      type: "spacers"
    };
  });

  console.log("Spacers extraction complete!\n");
  return designTokens;
}
