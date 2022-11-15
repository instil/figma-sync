import type {Node} from "figma-api";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import type {GetFileResult} from "figma-api/lib/api-types";
import {extractPage} from "./PageExtractor";
import {findChild} from "./children/ChildFinder";

interface Props {
  figmaGetFileResult: GetFileResult;
  pageName: string;
  frameName: string;
}

export function extractFrame({figmaGetFileResult, pageName, frameName}: Props): Node<"FRAME"> | undefined {
  const page = extractPage({figmaGetFileResult, pageName});
  if (!page) return undefined;

  const frame = findChild<"FRAME">(page, maybeFrame => isFrame(maybeFrame) && maybeFrame.name === frameName);
  if (!frame) return undefined;

  return frame;
}
