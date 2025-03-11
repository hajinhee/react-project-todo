import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom: persistAtomCommon } = recoilPersist({
  key: "persistAtomCommon",
});

export const todosAtom = atom({
  key: "app/todosAtom",
  default: [],
});

export const TodoList__filterCompletedIndexAtom = atom({
  key: "app/TodoList__filterCompletedIndexAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon],
});

export const TodoList__sortIndexAtom = atom({
  key: "app/TodoList__sortIndexAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon],
});
