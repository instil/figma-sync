import type {FRAME} from "figma-api";
import {isFrame} from "@src/loading/figma/types/figma-api/Frame";
import type {GetFileResult} from "figma-api/lib/api-types";
import {extractPage} from "./PageExtractor";
import {findChild} from "./children/ChildFinder";

interface Props {
  figmaGetFileResult: GetFileResult;
  pageName: string;
  frameName: string;
}

export function extractFrame({figmaGetFileResult, pageName, frameName}: Props): FRAME {
  const page = extractPage({figmaGetFileResult, pageName});

  const frame = findChild<FRAME>(page, maybeFrame => isFrame(maybeFrame) && maybeFrame.name === frameName);
  if (!frame) throw new Error(`Could not find frame on page ${pageName} called ${frameName}, is figma setup correctly?`);

  return frame;
}
