import type {GetFileResult} from "figma-api/lib/api-types";
import {extractFile} from "@src/loading/figma/extractors/FileExtractor";

export async function getFigmaFile(): Promise<GetFileResult> {
  return await extractFile();
}