"use client";

import { useEffect, useState } from "react";
import IntroScreen from "@/components/IntroScreen.jsx";
import QuizScreen from "@/components/QuizScreen.jsx";
import LoadingScreen from "@/components/LoadingScreen.jsx";
import ResultScreen from "@/components/ResultScreen.jsx";
import GameScreen from "@/components/GameScreen.jsx";
import CharacterCreationScreen from "@/components/CharacterCreationScreen.jsx";
import { QUESTION_BANK } from "@/lib/questions.js";
import { runMatcher, shuffle } from "@/lib/matcher.js";
import { computeStats } from "@/lib/stats.js";
import { GameStateProvider } from "@/lib/GameStateContext.js";
import { loadState, clearSave, hasSave } from "@/lib/persistence.js";

function buildCampaignProfile(match) {
  if (!match) return { primary: "influence", primaryLabel: "Influencia", secondaryLabel: "Resolver dos tramas", initialThreat: 0 };
  if (match.match_percent >= 75) return { primary: "control", primaryLabel: "Control territorial", secondaryLabel: "Asegurar 5 enclaves distintos", initialThreat: 1 };
  if (match.id?.includes("franco") || match.id?.includes("carrero")) return { primary: "stability", primaryLabel: "Estabilidad del régimen", secondaryLabel: "Terminar con amenaza 3 o menos", initialThreat: 2 };
  return { primary: "influence", primaryLabel: "Influencia política", secondaryLabel: "Ganar 14 de influencia o resolver dos tramas", initialThreat: 0 };
}

export default function Home() {
  const [phase, setPhase] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [fileNumber, setFileNumber] = useState("");
  const [character, setCharacter] = useState(null);
  const [pendingCharacter, setPendingCharacter] = useState(null);
  const [savedState, setSavedState] = useState(null);
  const [hasExistingSave, setHasExistingSave] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasExistingSave(hasSave());
    }
  }, []);

  const startQuiz = (mode) => {
    const shuffled = shuffle(QUESTION_BANK).slice(0, mode);
    setQuestions(shuffled);
    setAnswers([]);
    setCurrentIdx(0);
    const romans = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
    const greek = ["Α","Β","Γ","Δ","Ε","Ζ","Η","Θ","Λ","Μ","Ξ","Π","Σ","Φ","Ψ","Ω"];
    const year = 1700 + Math.floor(Math.random() * 325);
    setFileNumber(`${romans[Math.floor(Math.random()*romans.length)]}-${year}-${greek[Math.floor(Math.random()*greek.length)]}-${romans[Math.floor(Math.random()*romans.length)]}`);
    setPhase("quiz");
  };

  const handleAnswer = (optionIdx) => {
    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setPhase("loading");
      const delay = 2200 + Math.random() * 1300;
      setTimeout(() => {
        const r = runMatcher(questions, newAnswers);
        setResult(r);
        setPhase("result");
        window.scrollTo({ top: 0, behavior: "instant" });
      }, delay);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleRestart = () => {
    clearSave();
    setSavedState(null);
    setHasExistingSave(false);
    setPhase("intro");
    setQuestions([]);
    setAnswers([]);
    setCurrentIdx(0);
    setResult(null);
    setCharacter(null);
    setPendingCharacter(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleEnterGame = (match) => {
    const stats = computeStats(match.id, questions, answers);
    const campaignProfile = buildCampaignProfile(match);
    setPendingCharacter({
      politician: { id: match.id, name: match.name, epitaph: match.epitaph },
      stats,
      matchPercent: match.match_percent,
      fileNumber: result?.file_number ?? "",
      answers,
      campaignProfile,
    });
    setPhase("creation");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleConfirmCharacter = (finalCharacter) => {
    setCharacter(finalCharacter);
    setSavedState(null);
    setPhase("game");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleBackToResult = () => {
    setPhase("result");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleContinueSave = () => {
    const s = loadState();
    if (!s) {
      setHasExistingSave(false);
      return;
    }
    setSavedState(s);
    setCharacter(s.character);
    setPhase("game");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <>
      {phase === "intro" && <IntroScreen onStart={startQuiz} onContinue={hasExistingSave ? handleContinueSave : null} />}
      {phase === "quiz" && (
        <QuizScreen
          questions={questions}
          answers={answers}
          currentIdx={currentIdx}
          onAnswer={handleAnswer}
          onBack={handleBack}
          fileNumber={fileNumber}
        />
      )}
      {phase === "loading" && <LoadingScreen />}
      {phase === "result" && result && (
        <ResultScreen result={result} onRestart={handleRestart} onEnter={handleEnterGame} />
      )}
      {phase === "creation" && pendingCharacter && (
        <CharacterCreationScreen baseCharacter={pendingCharacter} onConfirm={handleConfirmCharacter} onBack={handleBackToResult} />
      )}
      {phase === "game" && character && (
        <GameStateProvider character={character} savedState={savedState}>
          <GameScreen onBack={handleBackToResult} onRestart={handleRestart} />
        </GameStateProvider>
      )}
    </>
  );
}
