import axios from "axios";

export const API_BASE_URL: string =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:5000/api";

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rg_token");
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export function errMsg(e: unknown): string {
  const anyE = e as { response?: { data?: { message?: string; errors?: { msg: string }[] } }; message?: string };
  const d = anyE.response?.data;
  if (d?.errors?.length) return d.errors.map((x) => x.msg).join(", ");
  if (d?.message) return d.message;
  if (anyE.message === "Network Error") return `Cannot reach the API at ${API_BASE_URL}. Is the server running?`;
  return anyE.message ?? "Something went wrong";
}

export type Report = {
  id: number; user_id: number; title: string; description: string; damage_type: string;
  severity: string; image_url: string | null; address: string; latitude: number; longitude: number;
  status: string; created_at: string; updated_at: string; reporter_name?: string;
  history?: { id: number; old_status: string | null; new_status: string; note: string | null; created_at: string; changed_by_name?: string }[];
};

export const STATUSES = ["pending", "verified", "in_progress", "resolved", "rejected"] as const;
export const SEVERITIES = ["low", "medium", "high", "critical"] as const;
export const DAMAGE_TYPES = ["pothole", "crack", "erosion", "waterlogging", "missing_cover", "other"] as const;
export const label = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
