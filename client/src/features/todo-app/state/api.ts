import { firebase, firestore, dataWithId } from "features/todo-app/firebase"
import { Task, ID, TaskList, User } from "../types"

export const getTasks = async (list_id: ID): Promise<Task[]> => {
  return firestore
    .collection("tasks")
    .where("list_id", "==", list_id)
    .get()
    .then(res => res.docs.map(dataWithId) as Task[])
}

export const addTask = async (
  task: Omit<Task, "id" | "created_at" | "updated_at" | "complete">,
): Promise<Task> => {
  return firestore
    .collection("tasks")
    .add({
      ...task,
      user_id: task.user_id || null,
      completed: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    .then(async x => {
      return dataWithId(await x.get()) as Task
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

export const editTask = async (
  task_id: ID,
  task_data: Partial<Omit<Task, "id">>,
): Promise<Task> => {
  await firestore
    .collection("tasks")
    .doc(task_id)
    .update({
      ...task_data,
      updated_at: Date.now(),
    })

  const edited_task = await firestore
    .collection("tasks")
    .doc(task_id)
    .get()
    .then(dataWithId)

  return edited_task as Task
}

export const removeTask = async (task_id: ID): Promise<ID> => {
  await firestore
    .collection("tasks")
    .doc(task_id)
    .delete()
  return task_id
}

export const createDefaultTaskList = (user_id: ID | null) => {
  return addTaskList({
    name: "Tasks",
    number_of_tasks: 0,
    primary: true,
    user_id,
  })
}

export const getTaskLists = async (user_id: ID | null): Promise<TaskList[]> => {
  return firestore
    .collection("task_lists")
    .where("user_id", "==", user_id)
    .get()
    .then(res => res.docs.map(dataWithId) as TaskList[])
}

export const addTaskList = async (
  list: Omit<TaskList, "id" | "created_at" | "updated_at">,
): Promise<TaskList> => {
  console.log("addTaskList", list)

  return firestore
    .collection("task_lists")
    .add({
      number_of_tasks: 0,
      primary: false,
      user_id: null,
      ...list,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    .then(async x => {
      return dataWithId(await x.get()) as TaskList
    })
    .catch(e => {
      console.log(e)
      return e
    })
}

export const editTaskList = async (
  list_id: ID,
  list_data: Partial<Omit<TaskList, "id" | "created_at" | "updated_at">>,
): Promise<TaskList> => {
  await firestore
    .collection("task_lists")
    .doc(list_id)
    .update({
      ...list_data,
      updated_at: Date.now(),
    })

  const edited_list = await firestore
    .collection("task_lists")
    .doc(list_id)
    .get()
    .then(dataWithId)

  return edited_list as TaskList
}

export const removeTaskList = async (list_id: ID): Promise<ID> => {
  await firestore
    .collection("task_lists")
    .doc(list_id)
    .delete()
  return list_id
}

const getPrimaryTaskList = async (
  user_id: ID | null,
): Promise<TaskList> => {
  const res = await firestore
    .collection("task_lists")
    .where("primary", "==", true)
    .where("user_id", "==", user_id)
    .limit(1)
    .get()

  const doc = res.docs[0]

  if (!doc) {
    throw Error("No primary list")
  }

  const list = dataWithId(doc)

  return list as TaskList
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}
