import type {Effect} from "figma-api";
import {EffectType} from "figma-api/lib/ast-types";
import {filterUndefined} from "@src/shared/stdlib/Arrays";

export const extractDropShadowEffects = (effects: (Effect | undefined)[]): Effect[] =>
  filterUndefined(effects)
    .filter(effect => effect.type === EffectType.DROP_SHADOW);

export const extractInsetShadowEffects = (effects: (Effect | undefined)[]): Effect[] =>
  filterUndefined(effects)
    .filter(effect => effect.type === EffectType.INNER_SHADOW);
