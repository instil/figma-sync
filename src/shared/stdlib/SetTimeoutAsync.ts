export function setTimeoutAsync(callback: (args: void) => void, waitForThisManyMilliseconds?: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        callback();
        resolve();
      } catch (error) {
        reject(error);
      }
    }, waitForThisManyMilliseconds);
  });
}

export async function waitFor(waitForThisManyMilliseconds?: number): Promise<void> {
  await setTimeoutAsync((): void => {
    // Do nothing
  }, waitForThisManyMilliseconds);
}
