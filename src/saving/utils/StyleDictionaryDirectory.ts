import {join} from "path";

export const styleDictionaryFolderName = "style-dictionary-source";

export const buildTemporaryStyleDictionaryDirectory = (): string => join(process.cwd(), styleDictionaryFolderName);

