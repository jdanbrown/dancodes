// Types matching the opencode + sidecar APIs

export interface Repo {
  name: string; // "owner/repo"
  path: string; // "/vol/projects/repos/owner__repo"
}

export interface GithubRepo {
  full_name: string;
  description?: string;
  private: boolean;
}

export interface Worktree {
  repo: string;
  session_id: string;
  path: string;
}

export interface Session {
  id: string;
  title?: string;
  directory?: string;
  parentID?: string;
  time_updated?: number;
  timeUpdated?: number;
}

export interface MessageInfo {
  id: string;
  role: "user" | "assistant" | "error";
  sessionID: string;
  modelID?: string;
  error?: {
    name?: string;
    message?: string;
    data?: { message?: string };
  };
}

export interface MessagePart {
  id: string;
  type: "text" | "reasoning" | "tool" | "step-start" | "step-finish" | "snapshot" | "patch" | "subtask" | "compaction";
  sessionID?: string;
  messageID?: string;
  text?: string;
  tool?: string;
  state?: ToolState;
  tokens?: {
    input?: number;
    output?: number;
    cache?: { read?: number };
  };
}

export interface ToolState {
  status: "pending" | "running" | "completed" | "error";
  title?: string;
  input?: Record<string, unknown>;
  output?: string;
  error?: string;
}

export interface Message {
  info: MessageInfo;
  parts: MessagePart[];
}

// SSE event shape from opencode
export interface SSEEvent {
  type: string;
  properties: Record<string, unknown>;
}

export interface Provider {
  id: string;
  name?: string;
  models?: Record<string, Model>;
}

export interface Model {
  id: string;
  name?: string;
}

export interface SelectedModel {
  providerID: string;
  modelID: string;
  name: string;
}
