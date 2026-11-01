export { jobLabels } from "@tubedict/shared";
export type { Lesson, Segment, SegmentState, ActionResult } from "@tubedict/shared";
export async function jsonRequest<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, { method: body === undefined ? "GET" : "POST", headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error ?? "서버에 연결하지 못했습니다.");
  return payload as T;
}
