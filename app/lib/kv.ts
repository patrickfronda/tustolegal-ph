export interface SessionData {
  id: string;
  questions: number;
  country: string;
  city: string;
  startTime: string;
}

export interface LawyerAppData {
  id: string;
  name: string;
  rollNumber: string;
  specialties: string[];
  location: string;
  experience: number;
  fee: string;
  phone: string;
  email: string;
  bio: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

/*
 * Talks to a Vercel KV / Upstash Redis store over its REST API using fetch.
 * No npm dependency required, so it works with the Upstash Redis integration
 * that Vercel now provisions (the old @vercel/kv package is deprecated).
 *
 * Reads connection info from the env vars set by the Vercel integration:
 *   KV_REST_API_URL / KV_REST_API_TOKEN  (Vercel KV naming)
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (Upstash naming)
 *
 * Every helper degrades gracefully (returns empty data) when no store is
 * configured, so the app still builds and runs without analytics persistence.
 */

const REST_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const REST_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

function today() {
  return new Date().toISOString().split("T")[0];
}

async function cmd<T = unknown>(args: (string | number)[]): Promise<T | null> {
  if (!REST_URL || !REST_TOKEN) return null;
  try {
    const res = await fetch(REST_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.result ?? null) as T | null;
  } catch {
    return null;
  }
}

async function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
  if (!REST_URL || !REST_TOKEN) return [];
  try {
    const res = await fetch(`${REST_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map((d) => d?.result ?? null) : [];
  } catch {
    return [];
  }
}

function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function flatArrayToObject(arr: unknown): Record<string, number> {
  // Upstash returns HGETALL as a flat [field, value, field, value, ...] array.
  if (!Array.isArray(arr)) {
    if (arr && typeof arr === "object") {
      const o: Record<string, number> = {};
      for (const [k, v] of Object.entries(arr as Record<string, unknown>)) o[k] = toNumber(v);
      return o;
    }
    return {};
  }
  const o: Record<string, number> = {};
  for (let i = 0; i < arr.length; i += 2) {
    o[String(arr[i])] = toNumber(arr[i + 1]);
  }
  return o;
}

function parseJSON<T>(v: unknown): T | null {
  if (v == null) return null;
  if (typeof v === "object") return v as T;
  try {
    return JSON.parse(String(v)) as T;
  } catch {
    return null;
  }
}

export async function trackVisit(country: string, city: string): Promise<void> {
  const d = today();
  await pipeline([
    ["INCR", "visits:total"],
    ["INCR", `visits:${d}`],
    ["HINCRBY", "locations:countries", country || "Unknown", 1],
    ["HINCRBY", "locations:cities", city || "Unknown", 1],
  ]);
}

export async function trackQuestion(sessionId: string, country: string, city: string): Promise<void> {
  const d = today();
  await pipeline([
    ["INCR", "questions:total"],
    ["INCR", `questions:${d}`],
  ]);

  const existing = parseJSON<SessionData>(await cmd(["GET", `session:${sessionId}`]));
  if (existing) {
    const updated: SessionData = { ...existing, questions: existing.questions + 1 };
    await cmd(["SET", `session:${sessionId}`, JSON.stringify(updated), "EX", 86400]);
  } else {
    const session: SessionData = {
      id: sessionId,
      questions: 1,
      country: country || "Unknown",
      city: city || "Unknown",
      startTime: new Date().toISOString(),
    };
    await cmd(["SET", `session:${sessionId}`, JSON.stringify(session), "EX", 86400]);
    await cmd(["LPUSH", "sessions:recent", sessionId]);
    await cmd(["LTRIM", "sessions:recent", 0, 49]);
  }
}

export async function getAnalytics() {
  const d = today();
  const [totalVisits, todayVisits, totalQuestions, todayQuestions, countries, cities, sessionIds,
    paymentsTotal, paymentsBasic, paymentsPlus, paymentsToday, paywallTotal, paywallToday] =
    await pipeline([
      ["GET", "visits:total"],
      ["GET", `visits:${d}`],
      ["GET", "questions:total"],
      ["GET", `questions:${d}`],
      ["HGETALL", "locations:countries"],
      ["HGETALL", "locations:cities"],
      ["LRANGE", "sessions:recent", 0, 19],
      ["GET", "payments:total"],
      ["GET", "payments:basic"],
      ["GET", "payments:plus"],
      ["GET", `payments:${d}`],
      ["GET", "paywall:total"],
      ["GET", `paywall:${d}`],
    ]);

  let recentSessions: SessionData[] = [];
  if (Array.isArray(sessionIds) && sessionIds.length > 0) {
    const sessionCmds = (sessionIds as string[]).map((id) => ["GET", `session:${id}`]);
    const results = await pipeline(sessionCmds);
    recentSessions = results
      .map((r) => parseJSON<SessionData>(r))
      .filter(Boolean) as SessionData[];
  }

  return {
    totalVisits: toNumber(totalVisits),
    todayVisits: toNumber(todayVisits),
    totalQuestions: toNumber(totalQuestions),
    todayQuestions: toNumber(todayQuestions),
    countries: flatArrayToObject(countries),
    cities: flatArrayToObject(cities),
    recentSessions,
    paymentStats: {
      total: toNumber(paymentsTotal),
      basic: toNumber(paymentsBasic),
      plus: toNumber(paymentsPlus),
      today: toNumber(paymentsToday),
      paywallTotal: toNumber(paywallTotal),
      paywallToday: toNumber(paywallToday),
    },
  };
}

export async function submitApplication(data: Omit<LawyerAppData, "id" | "status" | "submittedAt">): Promise<string> {
  const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const app: LawyerAppData = { ...data, id, status: "pending", submittedAt: new Date().toISOString() };
  await cmd(["SET", `lawyer:app:${id}`, JSON.stringify(app)]);
  await cmd(["SADD", "lawyers:pending", id]);
  return id;
}

async function getApplicationsByStatus(status: "pending" | "approved" | "rejected"): Promise<LawyerAppData[]> {
  const ids = await cmd<string[]>(["SMEMBERS", `lawyers:${status}`]);
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const results = await pipeline(ids.map((id) => ["GET", `lawyer:app:${id}`]));
  return results
    .map((r) => parseJSON<LawyerAppData>(r))
    .filter(Boolean) as LawyerAppData[];
}

export const getApplications = getApplicationsByStatus;

export async function updateApplication(id: string, status: "approved" | "rejected"): Promise<void> {
  const app = parseJSON<LawyerAppData>(await cmd(["GET", `lawyer:app:${id}`]));
  if (!app) return;
  const oldStatus = app.status;
  await cmd(["SET", `lawyer:app:${id}`, JSON.stringify({ ...app, status })]);
  await cmd(["SREM", `lawyers:${oldStatus}`, id]);
  await cmd(["SADD", `lawyers:${status}`, id]);
}

export async function getApprovedLawyers(): Promise<LawyerAppData[]> {
  return getApplicationsByStatus("approved");
}

export async function getUserQuestionCount(userId: string): Promise<number> {
  const count = await cmd<string>(["GET", `user:${userId}:qcount`]);
  return toNumber(count);
}

export async function incrementUserQuestionCount(userId: string): Promise<number> {
  const newCount = await cmd<number>(["INCR", `user:${userId}:qcount`]);
  // Set 24h TTL only on first question so the window starts from then
  if (toNumber(newCount) === 1) {
    await cmd(["EXPIRE", `user:${userId}:qcount`, 86400]);
  }
  return toNumber(newCount);
}

export async function trackPayment(plan: "basic" | "plus"): Promise<void> {
  const d = today();
  await pipeline([
    ["INCR", "payments:total"],
    ["INCR", `payments:${plan}`],
    ["INCR", `payments:${d}`],
  ]);
}

export async function trackPaywallHit(userId: string): Promise<void> {
  const flagKey = `user:${userId}:paywallHit`;
  const already = await cmd<string>(["GET", flagKey]);
  if (already) return;
  const d = today();
  await pipeline([
    ["SET", flagKey, "1", "EX", 86400 * 30],
    ["INCR", "paywall:total"],
    ["INCR", `paywall:${d}`],
  ]);
}
