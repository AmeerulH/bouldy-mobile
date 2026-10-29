// Metro resolves credentials.native.ts on iOS/Android. Browser JS never reads a bearer token.
export const readCredential = async (): Promise<string|null> => null;
export const writeCredential = async (_token: string|null) => {};
