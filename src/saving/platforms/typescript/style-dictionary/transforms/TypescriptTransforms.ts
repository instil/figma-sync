import type {ValueTransform} from "style-dictionary/types/Transform";
import type {Config} from "style-dictionary";
import {transform as transforms} from "style-dictionary";

const colorNameTransform: ValueTransform["transformer"] = (token, options) => {
  return transforms["name/ti/camel"].transformer(token, options);
};

const colorValueTransform: ValueTransform["transformer"] = (token, options) => {
  return transforms["color/UIColorSwift"].transformer(token, options);
};

const fontNameTransform: ValueTransform["transformer"] = (token, options) => {
  return transforms["name/ti/camel"].transformer(token, options);
};

const fontValueTransform: ValueTransform["transformer"] = (token, options) => {
  return transforms["content/swift/literal"].transformer(token, options);
};

export const typescriptTransforms: Config["transform"] = {
  colorNameTransform: {
    type: "name",
    matcher: (token) => {
      return token.type === "color";
    },
    transformer: colorNameTransform
  },
  colorValueTransform: {
    type: "value",
    transitive: true,
    matcher: (token) => {
      return token.type === "color";
    },
    transformer: colorValueTransform
  },
  fontTransform: {
    type: "name",
    matcher: (token) => {
      return token.type === "typography";
    },
    transformer: fontNameTransform
  },
  fontValueTransform: {
    type: "value",
    transitive: true,
    matcher: (token) => {
      return token.type === "typography";
    },
    transformer: fontValueTransform
  }
};
export const iosTransformKeys = Object.keys(typescriptTransforms ?? []);