export const log = {
  info: (msg: string, ...args: any[]) => console.log("[info]", msg, ...args),
  error: (msg: string, ...args: any[]) =>
    console.error("[error]", msg, ...args),
};
