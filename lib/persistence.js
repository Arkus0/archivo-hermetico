// Persistencia ligera en localStorage. Versionada para permitir migración futura.

import { GAME_STATE_VERSION } from "./gameState.js";

export const STORAGE_KEY = "archivo-hermetico:save:v1";

const MIGRATIONS = {
  // Migración 0 → 1: añade doom si falta y normaliza shape mínimo.
  0: (s) => ({
    ...s,
    version: 1,
    doom: s.doom ?? { value: 0, max: 12, lastTriggered: [] },
    reputation: s.reputation ?? { politicians: {}, factions: {} },
    quests: s.quests ?? {},
    encountersSeen: s.encountersSeen ?? {},
    npcs: s.npcs ?? {},
    pendingDoomEvents: s.pendingDoomEvents ?? [],
    log: s.log ?? [],
    eventLog: s.eventLog ?? [],
  }),
};

function safeParse(str) {
  try { return JSON.parse(str); } catch { return null; }
}

export function saveState(state) {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadState() {
  if (typeof window === "undefined") return null;
  let raw;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch { return null; }
  if (!raw) return null;
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return null;
  return migrate(parsed, parsed.version ?? 0);
}

export function migrate(state, fromVersion) {
  let current = state;
  let v = fromVersion;
  while (v < GAME_STATE_VERSION) {
    const fn = MIGRATIONS[v];
    if (!fn) {
      // No migration registered; bump version and pray.
      current = { ...current, version: v + 1 };
    } else {
      current = fn(current);
    }
    v += 1;
  }
  return current;
}

export function clearSave() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function hasSave() {
  if (typeof window === "undefined") return false;
  try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; }
}
