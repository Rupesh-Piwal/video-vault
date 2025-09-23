import { randomBytes, createHash } from "crypto";

export function genToken(len = 24) {
  return randomBytes(Math.ceil(len * 0.75)).toString("base64url");
}
export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
