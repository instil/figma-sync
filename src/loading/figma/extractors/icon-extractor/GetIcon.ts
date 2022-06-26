import type {SvgDictionary} from "@src/loading/figma/types/design-token/SvgDictionary";
import type {NodeAnd} from "@src/loading/figma/extractors/utils/children/ChildFilter";
import {filterChildren} from "@src/loading/figma/extractors/utils/children/ChildFilter";
import type {FRAME} from "figma-api";
import {figmaApi} from "@src/loading/figma/providers/FigmaApi";
import {figmaId} from "@src/config/providers/Config";
import axios from "axios";
import {logPercentage} from "@src/loading/figma/extractors/utils/PercentageLogger";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import {isBooleanOperation} from "@src/loading/figma/types/figma-api/BooleanOperation";
import {isGroup} from "@src/loading/figma/types/figma-api/Group";
import {isRectangle} from "@src/loading/figma/types/figma-api/Rectangle";
import {isVector} from "@src/loading/figma/types/figma-api/Vector";
import {throttledRequest} from "./utils/ThrottledRequest";

let completedRequests = 0;

export async function addSvgToDictonary(svgs: SvgDictionary, iconContainer: NodeAnd<FRAME>, length: number): Promise<void> {
  const iconName = iconContainer.name;

  const svgId = getSvgId(iconContainer);
  if (!svgId) {
    throw Error(`No svg id found for '${iconName}', is figma setup correctly?`);
  }

  const getImageResponse = await throttledRequest(async () => {
    return figmaApi().getImage(figmaId(), {
      ids: svgId,
      format: "svg",
      scale: 1
    });
  });
  if (getImageResponse.err) throw Error(`Failed to get the image for '${iconName}' due to error '${getImageResponse.err}'`);

  const s3ImageUrl = getImageResponse.images[svgId];
  if (!s3ImageUrl) throw Error(`No image url provided on getImage response for icon ${iconName}`);

  const s3ImageResponse = await axios.get(s3ImageUrl);

  svgs[iconName] = removeSpecifiedFills(s3ImageResponse.data);
  completedRequests++;
  logPercentage({
    type: "icons",
    index: completedRequests,
    length,
    extra: iconName
  });
}

function getSvgId(
  iconContainer: NodeAnd<FRAME>
): string | undefined {
  const frame = filterChildren(iconContainer, isFrame)[0];
  if (frame) {
    const svg = filterChildren(frame, isBooleanOperation)[0];
    return svg?.id ?? frame.id;
  }

  const group = filterChildren(iconContainer, isGroup)[0];
  if (group) {
    return group.id;
  }

  const rectangle = filterChildren(iconContainer, isRectangle)[0];
  if (rectangle) {
    return iconContainer.id;
  }

  const svg = filterChildren(iconContainer, isBooleanOperation)[0];
  if (svg) {
    return iconContainer.id;
  }

  const vector = filterChildren(iconContainer, isVector)[0];
  if (vector) {
    return iconContainer.id;
  }

  return undefined;
}

function removeSpecifiedFills(xml: string): string {
  return xml.replace(/fill="(#.+)"/g, "fill=\"currentColor\"");
}
