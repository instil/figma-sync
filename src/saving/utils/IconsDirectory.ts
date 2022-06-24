import {join} from "path";
import {generatedFilesDirectory} from "@src/saving/providers/Environment";

export const iconBuildFolder = (): string => join(process.cwd(), generatedFilesDirectory(), "icons");
