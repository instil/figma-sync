import type {GetFileResult} from "figma-api/lib/api-types";
import {figmaApi} from "@src/loading/figma/providers/FigmaApi";
import {figmaId} from "@src/config/providers/Config";
import type {NodeWithChildren} from "@src/loading/figma/extractors/figma-component-extractors/children/types/NodeWithChildren";
import {isNodeWithChildren} from "@src/loading/figma/extractors/figma-component-extractors/children/types/NodeWithChildren";
import {throttledRequest} from "@src/loading/figma/extractors/throttle/ThrottledRequest";

export async function extractFile(): Promise<GetFileResult> {
  console.log("Downloading figma file...(Takes a long time due to rate limits and download limits...)");

  const figmaGetFileResult = await figmaApi().getFile(figmaId(), {
    depth: 1
  });
  await downloadNodesForEachTopLevelPage(figmaGetFileResult);

  console.log("Downloading figma file complete!");
  return figmaGetFileResult;
}

/**
 * We used to be able to just download the entire file, but Figma seems to have stunk in some "render timeout limits" without telling anyone
 * https://stackoverflow.com/questions/76175309/figma-api-fails-to-get-large-files
 *
 * So now we download each page's nodes individually (way slower, hits the api harder)
 */
async function downloadNodesForEachTopLevelPage(figmaGetFileResult: GetFileResult): Promise<void> {
  const pages = figmaGetFileResult.document.children;
  let numberOfPagesCompleted = 0;
  console.log(`Number of pages to download: ${pages.length}`);
  console.log(`0/${pages.length}`);

  await Promise.all(pages.map(async (child) => {
    await downloadChildrenAndStyles(figmaGetFileResult, child as NodeWithChildren, 1);
    console.log(`${++numberOfPagesCompleted}/${pages.length}`);
  }));
}

async function downloadChildrenAndStyles(figmaGetFileResult: GetFileResult, nodeWithoutChildren: NodeWithChildren, depth: number | undefined = undefined): Promise<void> {
  try {
    const restOfPage = await throttledRequest(async () => {
      return await figmaApi().getFileNodes(figmaId(), [nodeWithoutChildren.id], {depth});
    });
    const nodeWithChildrenDetails = Object.values(restOfPage.nodes)[0];
    if (!nodeWithChildrenDetails) return;

    figmaGetFileResult.styles = {
      ...figmaGetFileResult.styles,
      ...nodeWithChildrenDetails?.styles
    };

    const nodeWithChildren = nodeWithChildrenDetails.document;
    if (!isNodeWithChildren(nodeWithChildren)) return;
    nodeWithoutChildren.children = [...(nodeWithoutChildren.children ?? []), ...nodeWithChildren.children];

    if (depth !== undefined) {
      await Promise.all(nodeWithChildren.children.map(async childNode => {
        await downloadChildrenAndStyles(figmaGetFileResult, childNode as NodeWithChildren);
      }));
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}