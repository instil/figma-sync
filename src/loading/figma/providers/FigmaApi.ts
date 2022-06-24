import {Api as FigmaApi} from "figma-api/lib/api-class";
import {figmaApiKey} from "./Environment";

export const figmaApi = (): FigmaApi => new FigmaApi({
  personalAccessToken: figmaApiKey()
});
