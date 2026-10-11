/**
 * Project Camp API Types & Contracts
 * Based on API_CONTRACTS.md v1.1.0
 */

export type UserRole = "admin" | "project_admin" | "member";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface UserAvatar {
  url: string;
  localPath?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar: UserAvatar;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProjectItem {
  project: {
    _id: string;
    name: string;
    description?: string;
    members: number; // Computed member count
    createdBy: string;
    createdAt: string;
  };
  role: UserRole; // Current user's role in this project
}

export interface ProjectMemberDetail {
  project: string;
  user: {
    _id: string;
    username: string;
    fullName?: string;
    avatar: UserAvatar;
  };
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAttachment {
  url: string;
  mimetype: string;
  size: number;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string;
  assignedTo?: {
    _id: string;
    username: string;
    fullName?: string;
    avatar: UserAvatar;
  } | string;
  assignedBy?: string;
  status: TaskStatus;
  attachments: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  _id: string;
  title: string;
  task: string;
  isCompleted: boolean;
  createdBy: {
    _id: string;
    username: string;
    fullName?: string;
    avatar: UserAvatar;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetail extends Omit<Task, "assignedTo"> {
  assignedTo?: {
    _id: string;
    username: string;
    fullName?: string;
    avatar: UserAvatar;
  };
  subtasks: Subtask[];
}

export interface ProjectNote {
  _id: string;
  project: string;
  createdBy: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ApiErrorResponse {
  statusCode: number;
  data: null;
  message: string;
  success: false;
  errors?: Array<Record<string, string>> | any[];
}
