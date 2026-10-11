import { UserRole } from "@/types/api";

export interface NormalizedProject {
  _id: string;
  name: string;
  description?: string;
  members: number;
  role: UserRole;
  createdAt: string;
}

/**
 * Safely extracts a normalized project object regardless of whether
 * the backend returned:
 * 1. `{ project: { _id, name, ... }, role: "admin" }` (Enveloped format)
 * 2. `{ _id, name, description, ... }` (Direct flat entity format)
 */
export function extractProject(raw: any): NormalizedProject | null {
  if (!raw) return null;

  // Format 1: Nested { project: { _id, name, ... }, role }
  if (raw.project && typeof raw.project === "object" && (raw.project._id || raw.project.id)) {
    return {
      _id: String(raw.project._id || raw.project.id),
      name: String(raw.project.name || "Untitled Project"),
      description: raw.project.description || "",
      members:
        typeof raw.project.members === "number"
          ? raw.project.members
          : Array.isArray(raw.project.members)
          ? raw.project.members.length
          : 1,
      role: (raw.role as UserRole) || "member",
      createdAt: raw.project.createdAt || new Date().toISOString(),
    };
  }

  // Format 2: Direct flat project { _id, name, ... }
  if (raw._id || raw.id) {
    return {
      _id: String(raw._id || raw.id),
      name: String(raw.name || "Untitled Project"),
      description: raw.description || "",
      members:
        typeof raw.members === "number"
          ? raw.members
          : Array.isArray(raw.members)
          ? raw.members.length
          : 1,
      role: (raw.role as UserRole) || "member",
      createdAt: raw.createdAt || new Date().toISOString(),
    };
  }

  return null;
}
