import {waitFor} from "@src/shared/stdlib/SetTimeoutAsync";

// Currently, figma's api is limited to 5 active requests at once, but numbers above 2 seem to trigger the limit too
// TODO: Consider retries on rate limit failures so that this limit can be boosted, thereby making it a bit faster
const figmaApiThrottleLimit = 2;
let currentActiveFigmaRequests = 0;

export async function throttledRequest<T>(doRequest: () => Promise<T>): Promise<T> {
  if (currentActiveFigmaRequests === figmaApiThrottleLimit) {
    await waitFor(100);
    return throttledRequest(doRequest);
  }

  currentActiveFigmaRequests++;
  try {
    return await doRequest();
  } finally {
    currentActiveFigmaRequests--;
  }
}
