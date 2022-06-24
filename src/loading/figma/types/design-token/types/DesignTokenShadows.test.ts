import * as target from "./DesignTokenShadows";
import type {Effect} from "figma-api";
import {BlendMode, EffectType} from "figma-api/lib/ast-types";

const dropShadowEffects: Effect[] = [
  {
    "type": EffectType.DROP_SHADOW,
    "visible": true,
    "color": {
      "r": 0,
      "g": 0,
      "b": 0,
      "a": 0.10000000149011612
    },
    "blendMode": BlendMode.NORMAL,
    "offset": {
      "x": 0,
      "y": 4
    },
    "radius": 6
  },
  {
    "type": EffectType.DROP_SHADOW,
    "visible": true,
    "color": {
      "r": 0,
      "g": 0,
      "b": 0,
      "a": 0.05000000074505806
    },
    "blendMode": BlendMode.NORMAL,
    "offset": {
      "x": 0,
      "y": 2
    },
    "radius": 6
  },
  {
    "type": EffectType.DROP_SHADOW,
    "visible": true,
    "color": {
      "r": 0.1411764770746231,
      "g": 0.1411764770746231,
      "b": 0.1411764770746231,
      "a": 0.15000000596046448
    },
    "blendMode": BlendMode.NORMAL,
    "offset": {
      "x": 0,
      "y": 0
    },
    "radius": 0,
    "spread": 4
  },
  {
    "type": EffectType.DROP_SHADOW,
    "visible": true,
    "color": {
      "r": 0.1411764770746231,
      "g": 0.1411764770746231,
      "b": 0.1411764770746231,
      "a": 1
    },
    "blendMode": BlendMode.NORMAL,
    "offset": {
      "x": 0,
      "y": 0
    },
    "radius": 0,
    "spread": 0.5
  }
];

const dropInsetEffect: Effect = {
  "type": EffectType.INNER_SHADOW,
  "visible": true,
  "color": {
    "r": 0,
    "g": 0,
    "b": 0,
    "a": 0.07000000029802322
  },
  "blendMode": BlendMode.NORMAL,
  "offset": {
    "x": 0,
    "y": 1
  },
  "radius": 2,
  "spread": 1
};

describe("when generating box drop shadow definition", () => {
  it("should return generate box shadow definition when all effects are prsent", () => {
    const result = target.buildBoxDropShadowDefinition(dropShadowEffects);

    expect(result).toBe("box-shadow 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 6px rgba(0, 0, 0, 0.05), 0px 0px 0px rgba(0.14, 0.14, 0.14, 0.15), 0px 0px 0px rgba(0.14, 0.14, 0.14, 1)");
  });

  it("should return generate box shadow definition when only three effects present", () => {
    const result = target.buildBoxDropShadowDefinition([dropShadowEffects[0], dropShadowEffects[1], dropShadowEffects[2]]);

    expect(result).toBe("box-shadow 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 6px rgba(0, 0, 0, 0.05), 0px 0px 0px rgba(0.14, 0.14, 0.14, 0.15)");
  });

  it("should return generate box shadow definition when only two effects present", () => {
    const result = target.buildBoxDropShadowDefinition([dropShadowEffects[0], dropShadowEffects[1]]);

    expect(result).toBe("box-shadow 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 6px rgba(0, 0, 0, 0.05)");
  });

  it("should return generate box shadow definition when optional values are missing", () => {
    const result = target.buildBoxDropShadowDefinition([
      {
        ...dropShadowEffects[0],
        offset: undefined,
        color: undefined
      },
      {
        ...dropShadowEffects[1],
        offset: undefined,
        color: undefined
      },
      {
        ...dropShadowEffects[2],
        offset: undefined,
        color: undefined
      }
    ]);

    expect(result).toBe("box-shadow 0px 0px 6px rgba(0, 0, 0, 0), 0px 0px 6px rgba(0, 0, 0, 0), 0px 0px 0px rgba(0, 0, 0, 0)");
  });
});

describe("when generating box inset shadow definition", () => {
  it("should return generate box inset definition", () => {
    const result = target.buildBoxInsertShadowDefinition(dropInsetEffect);

    expect(result).toBe("box-shadow inset 0px 1px 2px rgba(0, 0, 0, 0.07)");
  });
});
