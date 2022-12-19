import {buildSpacersUnitConverter} from "./SpacersUnitConverter";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";
import {spacersConfig} from "@src/config/providers/Config";
import type {PixelSpacersConfig, RemSpacersConfig} from "@src/config/types/FigmaSyncConfig";

jest.mock("@src/config/providers/Config");

const spacersConfigMock = mockFunction(spacersConfig);

let target: ReturnType<typeof buildSpacersUnitConverter>;

interface TestCase {
  input: string;
  expected: string;
}

describe("given a rem spacers config", () => {
  let spacersConfig: RemSpacersConfig;

  beforeEach(() => {
    spacersConfig = {
      unitType: "rem",
      baseFontSize: 16
    };
    spacersConfigMock.mockReturnValue(spacersConfig);

    target = buildSpacersUnitConverter();
  });

  const testCases: TestCase[] = [
    {input: "1px", expected: "0.0625rem"},
    {input: "5px", expected: "0.3125rem"},
    {input: "10px", expected: "0.625rem"},
    {input: "20px", expected: "1.25rem"}
  ];

  testCases.forEach(({input, expected}) => {
    it(`should return '${expected}' for input '${input}'`, () => {
      const result = target(input);

      expect(result).toEqual(expected);
    });
  });

  describe("when the base font size is different", () => {
    beforeEach(() => {
      spacersConfig = {
        unitType: "rem",
        baseFontSize: 20
      };
      spacersConfigMock.mockReturnValue(spacersConfig);

      target = buildSpacersUnitConverter();
    });

    const testCases: TestCase[] = [
      {input: "1px", expected: "0.05rem"},
      {input: "5px", expected: "0.25rem"},
      {input: "10px", expected: "0.5rem"},
      {input: "20px", expected: "1rem"}
    ];

    testCases.forEach(({input, expected}) => {
      it(`should return '${expected}' for input '${input}'`, () => {
        const result = target(input);

        expect(result).toEqual(expected);
      });
    });
  });
});

describe("given a pixel spacers config", () => {
  let spacersConfig: PixelSpacersConfig;

  beforeEach(() => {
    spacersConfig = {
      unitType: "px"
    };
    spacersConfigMock.mockReturnValue(spacersConfig);

    target = buildSpacersUnitConverter();
  });

  const testCases: TestCase[] = [
    {input: "1px", expected: "1px"},
    {input: "5px", expected: "5px"},
    {input: "10px", expected: "10px"},
    {input: "20px", expected: "20px"}
  ];

  testCases.forEach(({input, expected}) => {
    it(`should return '${expected}' for input '${input}'`, () => {
      const result = target(input);

      expect(result).toEqual(expected);
    });
  });
});