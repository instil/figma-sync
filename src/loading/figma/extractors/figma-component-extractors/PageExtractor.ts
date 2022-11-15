import type {Node} from "figma-api";
import {isCanvas} from "@src/loading/figma/types/figma-api/Canvas";
import type {GetFileResult} from "figma-api/lib/api-types";
import {findChild} from "./children/ChildFinder";

interface Props {
  figmaGetFileResult: GetFileResult;
  pageName: string;
}

export function extractPage({figmaGetFileResult, pageName}: Props): Node<"CANVAS"> | undefined {
  const page = findChild<"CANVAS">(figmaGetFileResult.document, maybePage => isCanvas(maybePage) && maybePage.name === pageName);
  if (!page) return undefined;

  return page;
}
