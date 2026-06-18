import fs from "fs";
import path from "path";
import type { User, Application } from "./types";

const ON_VERCEL = !!process.env.VERCEL;

const DATA_DIR = ON_VERCEL ? "/tmp/tustojobs-data" : path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const APPS_FILE = path.join(DATA_DIR, "applications.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function writeUsers(users: User[]): void {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function getUserById(id: string): User | undefined {
  return readUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function saveUser(user: User): void {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  writeUsers(users);
}

export function readApplications(): Application[] {
  ensureDataDir();
  if (!fs.existsSync(APPS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(APPS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveApplication(app: Application): void {
  const apps = readApplications();
  apps.push(app);
  fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2));
}

export function getApplicationsByUser(userId: string): Application[] {
  return readApplications().filter((a) => a.userId === userId);
}

export function saveUploadedFile(userId: string, type: "photo" | "cv", buffer: Buffer, ext: string): string {
  if (ON_VERCEL) {
    // Store in /tmp — not publicly accessible via URL, but CV gets attached to emails
    const dir = `/tmp/tustojobs-uploads/${userId}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${type}.${ext}`), buffer);
    // Return a special marker so the UI shows "uploaded" state
    return `/_vercel_upload/${userId}/${type}.${ext}`;
  }
  const dir = path.join(process.cwd(), "public", "uploads", userId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${type}.${ext}`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/uploads/${userId}/${filename}`;
}
