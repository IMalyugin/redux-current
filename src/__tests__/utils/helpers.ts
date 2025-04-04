export const executeSafely = (fn: () => any) => {
  try {
    const mockErrorFn = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(mockErrorFn);
    const result = fn();
    mockErrorFn.mockRestore();
    return [result, null];
  } catch (err) {
    return [{}, err];
  }
};

export const zipArgs = (
  args: string[],
  accum: Record<string, string> = {},
): Record<string, string> => ({
  ...accum,
  ...(args.length && args[0] && { [args[0]]: JSON.parse(args[1]) }),
  ...(args.length && zipArgs(args.slice(2), accum)),
});
