import { addDoc, collection } from "firebase/firestore"
import { db } from "../config/firebase";

const useLogAnalytics = (
  taskId,
  taskCreated,
  taskCompleted,
  taskDeleted,
  userId,
) => {

  useEffect(() => {

  }, [taskId])
}