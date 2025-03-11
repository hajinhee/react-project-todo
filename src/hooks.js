import { useRecoilState } from "recoil";
import { todosAtom } from "./atoms";
import { useEffect } from "react";
import config from "./config";

export function useTodosStatus() {
  const [todos, setTodos] = useRecoilState(todosAtom);

  useEffect(() => {
    fetch(`${config.FLASK_URL}/todos`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        const newTodos = data.map((el) => ({
          id: el.no,
          content: el.content,
          regDate: el.reg_date,
          performDate: el.perform_date,
          checked: el.is_completed,
        }));
        setTodos(newTodos);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  // 할일 추가
  const addTodo = (performDate, newContent) => {
    const id = todos.length === 0 ? 1 : todos[0].id + 1;
    const newTodos = {
      id: id,
      content: newContent,
      regDate: new Date().toISOString(),
      performDate: performDate,
      checked: false,
    };

    console.log("newTodos: ", newTodos);
    fetch(`${config.FLASK_URL}/todos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodos),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        const newTodos = data.map((el) => ({
          id: el.no,
          content: el.content,
          regDate: el.reg_date,
          performDate: el.perform_date,
          checked: el.is_completed,
        }));
        setTodos(newTodos);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
    setTodos((todos) => [newTodos, ...todos]);

    return id;
  };

  // 할일 삭제
  const deleteTodo = (id) => {
    const newTodos = todos.filter((el, _) => id !== el.id);
    setTodos(newTodos);
  };

  // 할일 수정
  const modifyTodo = (id, performDate, newContent) => {
    const newTodos = todos.map((el) =>
      el.id === id
        ? {
            ...el,
            performDate: performDate,
            content: newContent,
          }
        : el
    );

    setTodos(newTodos);
  };

  const toggleCheckBox = (id) => {
    const newTodos = todos.map((el) =>
      el.id === id
        ? {
            ...el,
            checked: !el.checked,
          }
        : el
    );

    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    modifyTodo,
    toggleCheckBox,
  };
}
