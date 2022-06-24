import {fn} from "jest-mock";
import type {FunctionLike, UnknownFunction, Mock, Mocked, MockedFunction} from "jest-mock";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMockInstance<T extends FunctionLike = UnknownFunction>(type: new (...args: any[]) => T, index = 0): Mocked<T> {
  const classMockReference = type as unknown as Mock<T>;
  return (classMockReference.mock.instances[index] as unknown) as Mocked<T>;
}

/**
 * To use ensure that the module has been mocked by jest e.g. `jest.mock("three")`
 * @param type contains the type of what you want to mock, like `THREE.Scene`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMockInstance<T>(type: new (...args: any[]) => T): Mocked<T> {
  return new type([]) as Mocked<T>;
}

/**
 * This will allow us to add getter and setter mocks.
 * Both getter and setter are optional as sometimes we only want to mock one or the other
 */
export function addGetterAndSetterToMock<T, K>(mock: T, propertyName: keyof T): [MockedFunction<() => K>, MockedFunction<(value: K) => void>] {
  return [
    addGetterToMock<T, K>(mock, propertyName),
    addSetterToMock<T, K>(mock, propertyName)
  ];
}

export function addSetterToMock<T, K>(mock: T, propertyName: keyof T): MockedFunction<(value: K) => void> {
  const set = fn();
  Object.defineProperty(mock, propertyName, {set});
  return set as MockedFunction<(value: K) => void>;
}

export function addGetterToMock<T, K>(mock: T, propertyName: keyof T): MockedFunction<() => K> {
  const get = fn();
  Object.defineProperty(mock, propertyName, {get});
  return get as MockedFunction<() => K>;
}

export function castMockObject<T>(object: T): Mocked<T> {
  return object as Mocked<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mockFunction<T extends (...args: any[]) => any>(fn: T): MockedFunction<T> {
  return fn as MockedFunction<T>;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addMockedProperties<T>(mock: Mocked<T>, ...properties: { key: keyof T; value: any }[]): void {
  properties.forEach(({key, value}) => mock[key] = value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackWithFunctionOnFirstParameter<CallbackSignature extends (...params: any[]) => void> = (listener: CallbackSignature, ...ignoredTrailingParams: any) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function captureCallback<CallbackSignature extends (...params: any[]) => void>(
  mock: MockedFunction<CallbackWithFunctionOnFirstParameter<CallbackSignature>>
): () => void {
  let capturedCallback: CallbackSignature;
  mock.mockImplementation(x => capturedCallback = x);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...params: any[]) => capturedCallback(...params);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackWithFunctionOnSecondParameter<CallbackSignature extends (...params: any[]) => void> = (ignoredFirstParam: any, listener: CallbackSignature, ...ignoredTrailingParams: any) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function captureCallbackOnSecondParameter<CallbackSignature extends (...params: any[]) => void>(
  mock: MockedFunction<CallbackWithFunctionOnSecondParameter<CallbackSignature>>
): () => void {
  let capturedCallback: CallbackSignature;
  mock.mockImplementation((_, x) => capturedCallback = x);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...params: any[]) => capturedCallback(...params);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function captureAllParameters(mock: MockedFunction<any>): unknown[] {
  const capturedParameters: unknown[] = [];
  mock.mockImplementation((...args: unknown[]) => {
    capturedParameters.splice(0, capturedParameters.length);
    capturedParameters.push(...args);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return capturedParameters;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CallbackContainer<CallbackSignature extends (...params: any[]) => void> {
  callback: CallbackSignature;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function captureCallbackLazy<CallbackSignature extends (...params: any[]) => void>(
  mock: MockedFunction<CallbackWithFunctionOnFirstParameter<CallbackSignature>>
): CallbackContainer<CallbackSignature> {
  const callbackContainer: CallbackContainer<CallbackSignature> = {} as CallbackContainer<CallbackSignature>;
  mock.mockImplementation(callback => {
    callbackContainer.callback = callback;
  });
  return callbackContainer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function captureCallbackOnSecondParameterLazy<CallbackSignature extends (...params: any[]) => void>(
  mock: MockedFunction<CallbackWithFunctionOnSecondParameter<CallbackSignature>>
): CallbackContainer<CallbackSignature> {
  const callbackContainer: CallbackContainer<CallbackSignature> = {} as CallbackContainer<CallbackSignature>;
  mock.mockImplementation((_, callback) => {
    callbackContainer.callback = callback;
  });
  return callbackContainer;
}
