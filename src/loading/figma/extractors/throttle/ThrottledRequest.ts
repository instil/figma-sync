import {waitFor} from "@src/shared/stdlib/SetTimeoutAsync";

// Currently, figma's api is limited to 5 active requests at once, but numbers above 2 seem to trigger the limit too
const figmaApiThrottleLimit = 5;
let currentActiveFigmaRequests = 0;
const maxNumberOfRetries = 2000;

export async function throttledRequest<T>(doRequest: () => Promise<T>, numberOfRetries = 0): Promise<T> {
  if (currentActiveFigmaRequests === figmaApiThrottleLimit) {
    await waitFor(100);
    return throttledRequest(doRequest, numberOfRetries);
  }

  currentActiveFigmaRequests++;
  try {
    const result = await doRequest();
    currentActiveFigmaRequests--;
    return result;
  } catch (error) {
    if (numberOfRetries === maxNumberOfRetries) {
      console.log("Ran out of retries");
      throw error;
    }

    currentActiveFigmaRequests--;
    await waitFor(1000);
    return throttledRequest(doRequest, numberOfRetries + 1);
  }
}
