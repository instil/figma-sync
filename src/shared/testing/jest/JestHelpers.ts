import type {Mocked} from "jest-mock";
import {fn} from "jest-mock";

export function castMockObject<T>(object: T): Mocked<T> {
  return object as Mocked<T>;
}

/**
 * This is required due to an issue were #createMockInstance does not add a `jest.fn` to functions inherited from an interface
 * @param functions contains a list of functions that you want to add a `jest.fn` to
 */
export function createMockObjectOf<T>(...functions: (keyof T)[]): Mocked<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockObj: any = {};
  functions.forEach(functionKey => mockObj[functionKey] = fn());
  return mockObj as Mocked<T>;
}
