import type {CANVAS} from "figma-api";
import {isCanvas} from "@src/loading/figma/types/figma-api/Canvas";
import type {GetFileResult} from "figma-api/lib/api-types";
import {findChild} from "./children/ChildFinder";

interface Props {
  figmaGetFileResult: GetFileResult;
  pageName: string;
}

export function extractPage({figmaGetFileResult, pageName}: Props): CANVAS {
  const page = findChild<CANVAS>(figmaGetFileResult.document, maybePage => isCanvas(maybePage) && maybePage.name === pageName);
  if (!page) throw new Error(`Could not find page called ${pageName}, is figma setup correctly?`);

  return page;
}
