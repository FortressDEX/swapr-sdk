/* eslint-disable @typescript-eslint/no-empty-interface */
interface CustomMatchers<R = unknown> {
  toBeAddress(): R
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

export {}
