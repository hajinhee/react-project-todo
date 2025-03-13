import { useRecoilState } from "recoil";
import { todosAtom } from "./atoms";
import { useEffect } from "react";
import config from "./config";

export function useTodosStatus() {
  const [todos, setTodos] = useRecoilState(todosAtom);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${config.FLASK_URL}/todos`);
        if (!res.ok) throw new Error("Failed to fetch todos");

        const data = await res.json();
        const newTodos = data.map((el) => ({
          no: el.no,
          content: el.content,
          regDate: el.reg_date,
          performDate: el.perform_date,
          checked: el.is_completed,
        }));
        setTodos(newTodos);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTodos();
  }, []);

  // 할일 추가
  const addTodo = async (performDate, newContent) => {
    let no = todos.length === 0 ? 1 : todos[todos.length - 1].no + 1;
    const newTodo = {
      no,
      content: newContent,
      regDate: new Date().toISOString(),
      performDate: performDate,
      checked: false,
    };
    try {
      const res = await fetch(`${config.FLASK_URL}/todos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      if (!res.ok) throw new Error("Failed to add todo");
      // setTodos((prevTodos) => [newTodo, ...prevTodos]);
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // 할일 삭제
  const deleteTodo = async (no) => {
    try {
      const res = await fetch(`${config.FLASK_URL}/todos/${no}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.no !== no));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // 수정 함수
  const updateTodo = async (no, updatedFields) => {
    try {
      const res = await fetch(`${config.FLASK_URL}/todos/${no}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      setTodos((prevTodos) =>
        prevTodos.map((el) => (el.no === no ? { ...el, ...updatedFields } : el))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // 할일 수정
  const modifyTodo = async (no, performDate, newContent) => {
    await updateTodo(no, { performDate, content: newContent });
  };

  // 체크박스 수정
  const toggleCheckBox = async (no) => {
    const todo = todos.find((el) => el.no === no);
    if (!todo) return;

    await updateTodo(no, { checked: !todo.checked });
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    modifyTodo,
    toggleCheckBox,
  };
}
