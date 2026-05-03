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
import { TaskCard } from "../Cards";
import { addDoc, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useReloadContext } from '../../context/ReloadContext';
import syncToSearch from '../../services/SyncToSearch';
import { logAnalytics } from '../../services/logAnalytics';

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

function CreateProjectWithAi({ prompt, closeModal }) {
  const { reloadComponent } = useReloadContext();
  const user = auth.currentUser;
  const [aiLoading, setAiLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [aiProjectData, setAiProjectData] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [promptText, setPromptText] = useState(prompt || "");

  useEffect(() => {
    const check = async () => {
      const result = await checkIsPro();
      setIsPro(result);
    };

    check();
  }, []);

  const toggleHandleCreateProjectWithAI = async () => {
    if (!promptText || !promptText.trim()) {
      toast.warn("Prompt cannot be empty.");
      return;
    }

    try {
      setAiLoading(true);

      const aiData = await handleCreateProjectWithAI(promptText);

      if (!aiData) {
        toast.error("Invalid AI response");
        return;
      }

      setAiProjectData(aiData);
      toast.success("Project generated successfully by UniPro");

    } catch (error) {
      console.error("AI failed:", error);
      toast.error("AI failed to create project");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateProjectWithDatabase = async () => {
    if (!aiProjectData || !user) {
      toast.error("Missing project data");
      return;
    }

    setProjectLoading(true);

    try {
      const projectPayload = {
        title: aiProjectData.projectTitle,
        description: aiProjectData.projectDescription,
        date: aiProjectData.dueDate,
        team: [{ uid: user.uid, username: user.displayName || 'You', email: user.email || '', photoURL: user.photoURL || '' }],
        status: "On-going",
        owner: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        targetDate: new Date(aiProjectData.dueDate)
      };

      const projectRef = await addDoc(collection(db, 'projects'), projectPayload);
      const projectId = projectRef.id;

      await setDoc(doc(db, "projects", projectId, "metrics", `${projectId}_metrics`), {
        projectActivity: 0,
        urgentTasks: 0,
        tasksCompleted: 0,
        totalCompletionTime: 0,
        highPriorityTasks: 0,
        mediumPriorityTasks: 0,
        lowPriorityTasks: 0,
        userActivity: [],
        tasksStarted: 0,
        tasksInReview: 0,
        overdueTasks: 0,
        dueSoonTasks: 0,
        tasksOnTime: 0,
        tasksLate: 0,
      });

      await syncToSearch('project', projectId, projectPayload);

      // Create tasks
      if (Array.isArray(aiProjectData.tasks)) {
        for (const taskData of aiProjectData.tasks) {
          const taskPayload = {
            title: taskData.title,
            description: taskData.description,
            deadline: Timestamp.fromDate(new Date(taskData.dueDate)),
            status: 'To-do',
            'project-id': projectId,
            'project-title': aiProjectData.projectTitle,
            team: [{ uid: user.uid, username: user.displayName || 'You', email: user.email || '', photoURL: user.photoURL || '' }],
            'team-uids': [user.uid],
            searchTitle: taskData.title.toLowerCase(),
            updatedAt: new Date(),
            priority: taskData.priority || 'Medium',
            category: taskData.category.toLowerCase() || '',
            completedAt: null,
            createdAt: new Date(),
          };

          const taskRef = await addDoc(collection(db, 'tasks'), taskPayload);
          const taskId = taskRef.id;

          await syncToSearch('task', taskId, taskPayload);
          logAnalytics({
            projectId,
            event: 'task_created',
            taskData: { ...taskPayload, id: taskId }
          });
        }
      }

      logAnalytics({
        projectId,
        event: 'task_created',
        taskData: {
          id: projectId,
          title: aiProjectData.projectTitle,
          description: aiProjectData.projectDescription,
          status: 'On-going',
          priority: 'Medium',
          team: [{ uid: user.uid, username: user.displayName || 'You', email: user.email || '', photoURL: user.photoURL || '' }],
          deadline: Timestamp.fromDate(new Date(aiProjectData.dueDate)),
          createdAt: new Date(),
          completedAt: null
        }
      });

      toast.success('Project and tasks created successfully!');
      setTimeout(() => {
        reloadComponent();
        closeModal();
      }, 800);

    } catch (error) {
      console.error("Failed to create project in database:", error);
      toast.error(`Error: ${error.message}`);
      setProjectLoading(false);
    }
  };

  if (!isPro) return null;

  return (
    <ModalOverlay>
      <div className="absolute bg-white rounded-md max-w-screen-md h-fit w-full p-4">
        <IconTitleSection 
          title="Create Project with UniPro"
          underTitle="AI predefined project creator"
          iconOnClick={closeModal}
          dataFeather="x"
        /> 

        <div>
          <div className="flex gap-2 items-center">
            <IconAction dataFeather="arrow-left" onClick={() => setAiProjectData(null)} />
            <h1 className="font-merriweather font-semibold text-xl text-gray py-2">{aiProjectData ? 'Everything starts here' : 'Describe your project idea'}</h1>
          </div>
          {!aiProjectData ? (
            <>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="
                  h-[15rem] w-full resize-none rounded-xl border border-green-400 bg-white p-4 text-sm text-gray-800
                  placeholder:text-gray-400 shadow-sm outline-none transition-all duration-200
                  ring-2 ring-green-100 focus:border-green-700 focus:ring-green-300
                "
                placeholder="Describe your project idea..."
              />
            </>

          ) : (
            <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-2">
              <IconTitleSection title="Generated Project" dataFeather="arrow-left" iconOnClick={() => setAiProjectData(null)}/>
              <section>
                <h2 className="font-bold text-lg">{aiProjectData.projectTitle}</h2>
                <p className="text-sm text-gray-600">{aiProjectData.projectDescription}</p>
                <p className="text-xs text-gray-400">Due: {aiProjectData.dueDate}</p>
              </section>

              <section className="grid lg:grid-cols-2 gap-2 grid-cols-1">
                {Array.isArray(aiProjectData.tasks) && aiProjectData.tasks.map((task, idx) => {
                  const taskDataForCard = {
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    category: task.category || '',
                    status: 'To-do',
                    'project-id': 'preview',
                    'project-title': aiProjectData.projectTitle,
                    team: [],
                    deadline: {
                      toDate: () => new Date(task.dueDate)
                    }
                  };
                  return (
                    <TaskCard
                      key={idx}
                      taskData={taskDataForCard}
                    />
                  );
                })}
              </section>
            </div>
          )}

          <div className="flex gap-1 justify-end">
            <Button
              text={aiLoading ? "Generating..." : (aiProjectData ? "Create Another" : "Generate Project With AI")}
              onClick={!aiLoading ? toggleHandleCreateProjectWithAI : undefined}
              className={`${aiLoading ? "cursor-not-allowed disabled" : ""} ${aiProjectData ? "hidden" : ""}`}
            />
            <Button
              text={projectLoading ? "Creating..." : "Create Project"}
              className={`${!aiProjectData ? "hidden" : ""} bg-violet-700 text-white hover:bg-violet-800`}
              onClick={!projectLoading ? handleCreateProjectWithDatabase : undefined}
            />
          </div>
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