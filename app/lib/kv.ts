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

function today() {
  return new Date().toISOString().split("T")[0];
}

async function kv() {
  const { kv: client } = await import("@vercel/kv");
  return client;
}

export async function trackVisit(country: string, city: string): Promise<void> {
  try {
    const c = await kv();
    const d = today();
    await Promise.all([
      c.incr("visits:total"),
      c.incr(`visits:${d}`),
      c.hincrby("locations:countries", country || "Unknown", 1),
      c.hincrby("locations:cities", city || "Unknown", 1),
    ]);
  } catch { /* silent if KV not configured */ }
}

export async function trackQuestion(sessionId: string, country: string, city: string): Promise<void> {
  try {
    const c = await kv();
    const d = today();
    await c.incr("questions:total");
    await c.incr(`questions:${d}`);

    const existing = await c.get<SessionData>(`session:${sessionId}`);
    if (existing) {
      await c.set(`session:${sessionId}`, { ...existing, questions: existing.questions + 1 }, { ex: 86400 });
    } else {
      const session: SessionData = {
        id: sessionId,
        questions: 1,
        country: country || "Unknown",
        city: city || "Unknown",
        startTime: new Date().toISOString(),
      };
      await c.set(`session:${sessionId}`, session, { ex: 86400 });
      await c.lpush("sessions:recent", sessionId);
      await c.ltrim("sessions:recent", 0, 49);
    }
  } catch { /* silent */ }
}

export async function getAnalytics() {
  try {
    const c = await kv();
    const d = today();
    const [totalVisits, todayVisits, totalQuestions, todayQuestions, countries, cities, sessionIds] =
      await Promise.all([
        c.get<number>("visits:total"),
        c.get<number>(`visits:${d}`),
        c.get<number>("questions:total"),
        c.get<number>(`questions:${d}`),
        c.hgetall("locations:countries"),
        c.hgetall("locations:cities"),
        c.lrange("sessions:recent", 0, 19),
      ]);

    const recentSessions = sessionIds && sessionIds.length > 0
      ? (await Promise.all((sessionIds as string[]).map((id) => c.get<SessionData>(`session:${id}`)))).filter(Boolean) as SessionData[]
      : [];

    return {
      totalVisits: (totalVisits as number) ?? 0,
      todayVisits: (todayVisits as number) ?? 0,
      totalQuestions: (totalQuestions as number) ?? 0,
      todayQuestions: (todayQuestions as number) ?? 0,
      countries: ((countries ?? {}) as Record<string, number>),
      cities: ((cities ?? {}) as Record<string, number>),
      recentSessions,
    };
  } catch {
    return { totalVisits: 0, todayVisits: 0, totalQuestions: 0, todayQuestions: 0, countries: {}, cities: {}, recentSessions: [] };
  }
}

export async function submitApplication(data: Omit<LawyerAppData, "id" | "status" | "submittedAt">): Promise<string> {
  const c = await kv();
  const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const app: LawyerAppData = { ...data, id, status: "pending", submittedAt: new Date().toISOString() };
  await c.set(`lawyer:app:${id}`, app);
  await c.sadd("lawyers:pending", id);
  return id;
}

async function getApplicationsByStatus(status: "pending" | "approved" | "rejected"): Promise<LawyerAppData[]> {
  try {
    const c = await kv();
    const ids = await c.smembers(`lawyers:${status}`);
    if (!ids || ids.length === 0) return [];
    const apps = await Promise.all((ids as string[]).map((id) => c.get<LawyerAppData>(`lawyer:app:${id}`)));
    return apps.filter(Boolean) as LawyerAppData[];
  } catch { return []; }
}

export const getApplications = getApplicationsByStatus;

export async function updateApplication(id: string, status: "approved" | "rejected"): Promise<void> {
  const c = await kv();
  const app = await c.get<LawyerAppData>(`lawyer:app:${id}`);
  if (!app) return;
  const oldStatus = app.status;
  await c.set(`lawyer:app:${id}`, { ...app, status });
  await c.srem(`lawyers:${oldStatus}`, id);
  await c.sadd(`lawyers:${status}`, id);
}

export async function getApprovedLawyers(): Promise<LawyerAppData[]> {
  return getApplicationsByStatus("approved");
}
