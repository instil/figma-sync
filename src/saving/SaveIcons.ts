import type {SvgDictionary} from "@src/loading/figma/types/design-token/SvgDictionary";
import {mkdirSync, writeFileSync} from "fs";
import {logPercentage} from "@src/loading/figma/extractors/utils/PercentageLogger";
import {iconBuildFolder} from "./utils/IconsDirectory";

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
    writeFileSync(`${iconDirectory}/${key}.svg`, value);
  });
}
