import type {Effect} from "figma-api";
import {round} from "lodash";

export interface DesignTokenShadows {
  [key: string]: DesignTokenShadow;
}

interface DesignTokenShadow {
  value: BoxDropShadowDefinition | BoxInsetShadowDefinition;
  type: "shadows";
}

export type BoxDropShadowDefinition = TwoPartDropBoxShadowDefinition | ThreePartDropBoxShadowDefinition | FourPartDropBoxShadowDefinition;
type TwoPartDropBoxShadowDefinition = `box-shadow ${BoxDropShadowDefinitionPart}, ${BoxDropShadowDefinitionPart}`;
type ThreePartDropBoxShadowDefinition = `box-shadow ${BoxDropShadowDefinitionPart}, ${BoxDropShadowDefinitionPart}, ${BoxDropShadowDefinitionPart}`;
type FourPartDropBoxShadowDefinition = `box-shadow ${BoxDropShadowDefinitionPart}, ${BoxDropShadowDefinitionPart}, ${BoxDropShadowDefinitionPart}, ${BoxDropShadowDefinitionPart}`;
export function buildBoxDropShadowDefinition(effects: Effect[]): BoxDropShadowDefinition {
  if (effects.length === 2) {
    return `box-shadow ${buildBoxShadowDefinitionPart(effects[0])}, ${buildBoxShadowDefinitionPart(effects[1])}`;
  }

  if (effects.length === 3) {
    return `box-shadow ${buildBoxShadowDefinitionPart(effects[0])}, ${buildBoxShadowDefinitionPart(effects[1])}, ${buildBoxShadowDefinitionPart(effects[2])}`;
  }

  return `box-shadow ${buildBoxShadowDefinitionPart(effects[0])}, ${buildBoxShadowDefinitionPart(effects[1])}, ${buildBoxShadowDefinitionPart(effects[2])}, ${buildBoxShadowDefinitionPart(effects[3])}`;
}

export type BoxInsetShadowDefinition = `box-shadow inset ${BoxDropShadowDefinitionPart}`;
export const buildBoxInsertShadowDefinition = (effect: Effect): BoxInsetShadowDefinition =>
  `box-shadow inset ${buildBoxShadowDefinitionPart(effect)}`;

type BoxDropShadowDefinitionPart = `${number}px ${number}px ${number}px rgba(${number}, ${number}, ${number}, ${number})`
const buildBoxShadowDefinitionPart = (effect: Effect): BoxDropShadowDefinitionPart =>
  `${effect.offset?.x || 0}px ${effect.offset?.y || 0}px ${effect.radius}px rgba(${roundToTwoDecimalPlaces(effect.color?.r)}, ${roundToTwoDecimalPlaces(effect.color?.g)}, ${roundToTwoDecimalPlaces(effect.color?.b)}, ${roundToTwoDecimalPlaces(effect.color?.a)})`;

const roundToTwoDecimalPlaces = (input: number | undefined): number =>
  input !== undefined ? round(input, 2) : 0;
