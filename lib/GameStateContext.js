"use client";

import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { gameReducer, makeInitialState } from "./gameState.js";
import { saveState } from "./persistence.js";

const GameStateContext = createContext(null);
const GameDispatchContext = createContext(null);

function useAutosave(state, debounceMs = 300) {
  const tRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => {
      saveState(state);
    }, debounceMs);
    return () => { if (tRef.current) clearTimeout(tRef.current); };
  }, [state, debounceMs]);
}

export function GameStateProvider({ character, savedState, children }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    savedState || makeInitialState(character)
  );
  useAutosave(state);
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGameState debe usarse dentro de <GameStateProvider>");
  return ctx;
}

export function useGameDispatch() {
  const ctx = useContext(GameDispatchContext);
  if (!ctx) throw new Error("useGameDispatch debe usarse dentro de <GameStateProvider>");
  return ctx;
}
