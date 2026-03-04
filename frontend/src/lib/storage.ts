// localStorage helpers with safe JSON parse

import { DEFAULT_FAVORITE_MODELS, DEFAULT_MODEL } from "./default_favorite_models";
import type { Repo, SelectedModel } from "./types";

const LS_LAST_REPO = "dancodes:lastRepo";
const LS_LAST_SESSION = "dancodes:lastSession";
const LS_LAST_MODEL = "dancodes:lastModel";
const LS_SESSION_DIRS = "dancodes:sessionDirs";
const LS_FAVORITES = "dancodes:favoriteModels";

function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadLastRepo(): Repo | null {
  return safeGet<Repo>(LS_LAST_REPO);
}
export function saveLastRepo(repo: Repo) {
  safeSet(LS_LAST_REPO, repo);
}

export function loadLastSession(): string | null {
  return safeGet<string>(LS_LAST_SESSION);
}
export function saveLastSession(id: string) {
  safeSet(LS_LAST_SESSION, id);
}

export function loadLastModel(): SelectedModel {
  const saved = safeGet<SelectedModel>(LS_LAST_MODEL);
  if (saved) return saved;
  // Parse "provider/model" key into a SelectedModel
  const sep = DEFAULT_MODEL.indexOf("/");
  return { providerID: DEFAULT_MODEL.slice(0, sep), modelID: DEFAULT_MODEL.slice(sep + 1), name: "" };
}
export function saveLastModel(model: SelectedModel) {
  safeSet(LS_LAST_MODEL, model);
}

export function loadSessionDirs(): Record<string, string> {
  return safeGet<Record<string, string>>(LS_SESSION_DIRS) ?? {};
}
export function saveSessionDirs(dirs: Record<string, string>) {
  safeSet(LS_SESSION_DIRS, dirs);
}

export function loadFavorites(): string[] {
  return safeGet<string[]>(LS_FAVORITES) ?? DEFAULT_FAVORITE_MODELS;
}
export function saveFavorites(favs: string[]) {
  safeSet(LS_FAVORITES, favs);
}

export function modelKey(providerID: string, modelID: string) {
  return `${providerID}/${modelID}`;
}
