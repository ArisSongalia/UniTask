import { db } from "../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useReloadContext } from "../context/ReloadContext";

export function useMoveStatus() {
  const { reloadComponent } = useReloadContext();

  const moveStatus = async ({ name, id, team }) => {
    const taskRef = doc(db, name, id);

    if(team.length === 0) return alert('Cannot move status: No available members assigned')

    try {
      const statusSnap = await getDoc(taskRef);
      if (statusSnap.exists()) {
        const data = statusSnap.data();
        const currentStatus = data.status;
          if (currentStatus === "On-going") {
            await updateDoc(taskRef, { status: "Finished" });
          } else if (currentStatus === "To-do") {
            await updateDoc(taskRef, { status: "In-progress"})
          } else if (currentStatus === "In-progress") {
            await updateDoc(taskRef, { status: "To-review"}) 
          } else if (currentStatus === "To-review") {
            await updateDoc(taskRef, { status: "Finished", completedAt: new Date()}) 
          } else {
            console.log("No update performed.");
          }
          reloadComponent();
          console.log('Update completed, ID: ', id)
      } else {
        console.log("Document does not exist.");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return moveStatus;
}

