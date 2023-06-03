import type {SvgDictionary} from "@src/loading/figma/types/design-token/SvgDictionary";
import {mkdirSync, writeFileSync} from "fs";
import {logPercentage} from "@src/loading/figma/extractors/logging/PercentageLogger";
import {iconBuildFolder} from "./utils/IconsDirectory";
import {join} from "path";

export function saveIcons(icons: SvgDictionary): void {
  const iconDirectory = iconBuildFolder();

  mkdirSync(iconDirectory, {
    recursive: true
  });

  const entries = Object.entries(icons);
  entries.forEach(([key, value], index) => {
    logPercentage({
      type: "icons",
      index,
      length: entries.length
    });
    writeFileSync(join(iconDirectory, `${key}.svg`), value);
  });
}
