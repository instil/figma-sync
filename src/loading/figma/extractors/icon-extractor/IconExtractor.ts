import type {GetFileResult} from "figma-api/lib/api-types";
import {extractPage} from "@src/loading/figma/extractors/utils/PageExtractor";
import {filterChildren} from "@src/loading/figma/extractors/utils/children/ChildFilter";
import {isComponent} from "@src/loading/figma/types/figma-api/Component";
import type {SvgDictionary} from "@src/loading/figma/types/design-token/SvgDictionary";
import {addSvgToDictonary} from "./GetIcon";

const pageName = "   ↳ Iconography";

export async function extractIcons(figmaGetFileResult: GetFileResult): Promise<SvgDictionary> {
  console.log("Extracting icons...");

  const fontFrame = extractPage({figmaGetFileResult, pageName});

  const iconContainers = filterChildren(fontFrame, isComponent);

  const networkRequests: Promise<void>[] = [];
  const svgs: SvgDictionary = {};
  for (let index = 0; index < iconContainers.length; index++) {
    networkRequests.push(addSvgToDictonary(svgs, iconContainers[index], iconContainers.length));
  }
  await Promise.all(networkRequests);

  console.log("Icon extraction complete!\n");
  return svgs;
}

