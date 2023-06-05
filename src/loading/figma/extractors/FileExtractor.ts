import type {GetFileResult} from "figma-api/lib/api-types";
import {figmaApi} from "@src/loading/figma/providers/FigmaApi";
import {figmaId} from "@src/config/providers/Config";
import type {Node} from "figma-api/lib/ast-types";

export async function extractFile(): Promise<GetFileResult> {
  console.log("Downloading figma file...");

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
  await Promise.all(figmaGetFileResult.document.children.map(async (child) => {
    await downloadChildrenAndStyles(figmaGetFileResult, child);
  }));
}

async function downloadChildrenAndStyles(figmaGetFileResult: GetFileResult, node: Node): Promise<void> {
  try {
    const restOfPage = await figmaApi().getFileNodes(figmaId(), [node.id]);
    const parentNode = Object.values(restOfPage.nodes)[0];

    figmaGetFileResult.styles = {
      ...figmaGetFileResult.styles,
      ...parentNode?.styles
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    node.children = parentNode?.document?.children ?? [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}