import {join} from "path";
import {outputFolder} from "@src/config/providers/Config";

export const iconBuildFolder = (): string => join(process.cwd(), outputFolder(), "icons");
