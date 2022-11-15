import type {GetFileResult} from "figma-api/lib/api-types";
import {extractPage} from "@src/loading/figma/extractors/figma-component-extractors/PageExtractor";
import {filterChildren} from "@src/loading/figma/extractors/figma-component-extractors/children/ChildFilter";
import {isComponent} from "@src/loading/figma/types/figma-api/Component";
import type {SvgDictionary} from "@src/loading/figma/types/design-token/SvgDictionary";
import {addSvgToDictionary} from "./icon-extractor/GetIcon";

const pageName = "   ↳ Iconography";

export async function extractIcons(figmaGetFileResult: GetFileResult): Promise<SvgDictionary> {
  console.log("Extracting icons...");

  const fontFrame = extractPage({figmaGetFileResult, pageName});
  if (!fontFrame) {
    console.warn(`When trying to extract icons could not find page called '${pageName}', is figma setup correctly?`);
    return {};
  }

  const iconContainers = filterChildren(fontFrame, isComponent);

  const networkRequests: Promise<void>[] = [];
  const svgs: SvgDictionary = {};
  for (let index = 0; index < iconContainers.length; index++) {
    networkRequests.push(addSvgToDictionary(svgs, iconContainers[index], iconContainers.length));
  }
  await Promise.all(networkRequests);

  console.log("Icon extraction complete!\n");
  return svgs;
}

