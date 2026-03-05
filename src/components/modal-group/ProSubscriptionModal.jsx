import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { handleAnalyzeTaskAI } from "../../services/frontend/createTaskWithAI";
import { IconAction } from "../Icon";
import { checkIsPro } from "../../services/CheckIsPro";
import { UnlockPro } from "./PaymentModals";

function ToggleAnalyzeTaskWithAI({ taskTitle, onAIResult }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const check = async () => {
      const result = await checkIsPro();
      setIsPro(result);
    };

    check();
  }, []);

  const handleToggleAnalyzeTaskAI = async () => {

    if (!taskTitle) {
      toast.warn("Please complete task title first");
      return;
    }

    try {
      setAiLoading(true);

      const aiData = await handleAnalyzeTaskAI(taskTitle);

      if (!aiData) {
        toast.error("Invalid AI response");
        throw new Error("Invalid AI response");
      }

      onAIResult(aiData);

      toast.success("Task configured successfully by UniPro");

    } catch (error) {
      console.error("AI failed:", error);
    } finally {
      setAiLoading(false);
    }
  };

  if (!isPro) return null;

  return (
    <IconAction
      dataFeather={aiLoading ? "loader" : "zap"}
      text={aiLoading ? "Analyzing..." : "AI Auto Fill"}
      iconOnClick={!aiLoading ? handleToggleAnalyzeTaskAI : undefined}
    />
  );
}

function ProSubscriptionButton() {
  const [unlockPro, setUnlockPro] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const check = async () => {
      const result = await checkIsPro();
      setIsPro(result);
    };

    check();
  }, []);

  const toggleUnlockPro = () => {
    setUnlockPro(!unlockPro);
  };

  return (
    <>
      {!isPro ? (
        <IconAction
          text="Unlock Uni Pro"
          dataFeather="unlock"
          iconOnClick={toggleUnlockPro}
          className="bg-violet-50 text-violet-700 border-violet-300 hover:bg-violet-700 hover:text-white"
        />
      ) : (
        <IconAction text="Powered by UniPro" dataFeather="zap"/>
      )}

      {unlockPro && <UnlockPro closeModal={toggleUnlockPro}/>}
    </>
  );
}

export {ProSubscriptionButton, ToggleAnalyzeTaskWithAI}