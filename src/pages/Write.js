import { Button, TextField } from "@mui/material";
import { useSnackBarStatus } from "../components/Snackbar";
import { useTodosStatus } from "../hooks";

function Write() {
  const todosStatus = useTodosStatus();
  const snackbarStatus = useSnackBarStatus();

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    if (form.content.value.length === 0) {
      alert("할일을 입력해 주세요.");
      form.content.focus();
      return;
    }

    if (form.performDate.value.length === 0) {
      alert("날짜를 입력해 주세요.");
      form.performDate.focus();
      return;
    }

    try {
      await todosStatus.addTodo(form.performDate.value, form.content.value);
      form.performDate.value = "";
      form.content.value = "";
      snackbarStatus.open(
        `${
          todosStatus.todos.length === 0
            ? 1
            : todosStatus.todos[todosStatus.todos.length - 1].no + 1
        }번 할일이 추가되었습니다.`
      );
    } catch (error) {
      console.error("할일 추가 오류:", error);
      alert("할일 추가에 실패했습니다.");
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-4 sm:gap-5 flex-1 p-5 sm:p-10"
        onSubmit={onSubmit}
      >
        <TextField
          name="performDate"
          label="언제 해야 하나요?"
          focused
          type="datetime-local"
        ></TextField>
        <TextField
          name="content"
          label="무엇을 해야 하나요?"
          type="text"
          className="flex-1"
          multiline
          InputProps={{ className: "flex-1 flex-col" }}
        ></TextField>
        <Button variant="contained" type="submit">
          <span className="pt-1">➕&nbsp;할일 추가</span>
        </Button>
      </form>
    </>
  );
}

export default Write;
