import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { handleAnalyzeTaskAI } from "../../services/frontend/createTaskWithAI";
import { handleCreateProjectWithAI } from "../../services/frontend/createProjectWithAi";
import Icon, { IconAction } from "../Icon";
import { checkIsPro } from "../../services/CheckIsPro";
import { UnlockPro } from "./PaymentModals";
import ModalOverlay from "../ModalOverlay";
import TitleSection, { IconTitleSection } from "../TitleSection";
import Button from "../Button";

function ToggleAnalyzeTaskWithAI ({ taskTitle, onAIResult }) {
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

function CreateProjectWithAi({ prompt, onAiResult, closeModal }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const check = async () => {
      const result = await checkIsPro();
      setIsPro(result);
    };

    check();
  }, []);

  const toggleHandleCreateProjectWithAI = async () => {

    if (!prompt) {
      toast.warn("Prompt cannot be empty.");
      return;
    }

    try {
      setAiLoading(true);

      const aiData = await handleCreateProjectWithAI(prompt);

      if (!aiData) {
        toast.error("Invalid AI response");
        throw new Error("Invalid AI response");
      }

      onAiResult(aiData);

      toast.success("Project created successfully by UniPro");

    } catch (error) {
      console.error("AI failed:", error);

    } finally {
      setAiLoading(false);
    }
  };

  if (!isPro) return null;

  return (
    // <IconAction
    //   dataFeather={aiLoading ? "loader" : "zap"}
    //   text={aiLoading ? "Creating Project..." : "Create Project With AI"}
    //   iconOnClick={
    //     !aiLoading
    //       ? toggleHandleCreateProjectWithAI
    //       : undefined
    //   }
    // />

    <ModalOverlay>
      <div className="absolute bg-white rounded-md max-w-screen-md h-fit w-full p-4">
        <IconTitleSection 
          title="Create Project with UniPro"
          underTitle="AI predefined project creator"
          iconOnClick={closeModal}
          dataFeather="x"
        /> 

        <div>
          <h1 className="font-merriweather font-semibold text-2xl text-gray py-4">Everything starts here</h1>
          <textarea
            className="
              h-[15rem]
              w-full
              resize-none
              rounded-xl
              border
              border-green-300
              bg-white
              p-4
              text-sm
              text-gray-800
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-green-700
              focus:ring-4
              focus:ring-green-200
              shadow-sm
            "
            placeholder="Describe your project idea..."
          />
          <Button text='Create Project' />
        </div>
      </div>

    </ModalOverlay>
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

export {ProSubscriptionButton, ToggleAnalyzeTaskWithAI, CreateProjectWithAi}