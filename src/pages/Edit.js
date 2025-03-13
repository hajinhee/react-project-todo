import {
  Button,
  Divider,
  List,
  ListItem,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { useSnackBarStatus } from "../components/Snackbar";
import { useTodosStatus } from "../hooks";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

export function useDrawerStatus() {
  const [openedId, setOpenedId] = useState(null);
  const opened = useMemo(() => openedId !== null, [openedId]);

  const open = (id) => {
    setOpenedId(id);
  };

  const close = () => {
    setOpenedId(null);
  };

  return {
    openedId,
    opened,
    open,
    close,
  };
}

export function Drawer({ status }) {
  const todosStatus = useTodosStatus();
  const snackbarStatus = useSnackBarStatus();

  const deleteTodoBtn = () => {
    if (window.confirm(`${status.openedId}번 할일을 삭제하시겠습니까?`)) {
      todosStatus.deleteTodo(Number(status.openedId));
      snackbarStatus.open(`${status.openedId}번 할일이 삭제되었습니다.`);
    }
    status.close();
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={status.opened}
        onClose={status.close}
        onOpen={() => {}}
      >
        <List>
          <ListItem className="flex gap-2">
            <span className="text-[color:var(--mui-color-primary-main)]">
              No.{status.openedId}
            </span>
            <span>To-Do</span>
          </ListItem>
          <Divider />
          <ListItem button onClick={deleteTodoBtn}>
            <span className="pt-2">🗑️ 삭제</span>
          </ListItem>
          <ListItem button component={NavLink} to={`/edit/${status.openedId}`}>
            <span className="pt-2">✏️ 수정</span>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}

function Edit() {
  const { no } = useParams();
  const todosStatus = useTodosStatus();
  const snackbarStatus = useSnackBarStatus();

  const navigate = useNavigate();

  const onSubmit = (e) => {
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

    todosStatus.modifyTodo(
      Number(no),
      form.performDate.value,
      form.content.value
    );
    form.performDate.value = "";
    form.content.value = "";

    snackbarStatus.open(`${no}번 할일이 수정되었습니다.`);

    navigate(-1); // 메인 페이지로 이동
  };

  const beforeTodo = todosStatus.todos.find((el) => el.no === Number(no));

  return (
    <>
      <form className="flex flex-col gap-5 flex-1 p-10" onSubmit={onSubmit}>
        <TextField
          name="performDate"
          label="언제 해야 하나요?"
          focused
          type="datetime-local"
          defaultValue={beforeTodo?.performDate}
        ></TextField>
        <TextField
          name="content"
          label="무엇을 해야 하나요?"
          type="text"
          className="flex-1"
          multiline
          defaultValue={beforeTodo?.content}
          InputProps={{ className: "flex-1 flex-col" }}
          data-shrink="true"
        ></TextField>
        <Button variant="contained" type="submit">
          <span className="pt-1">✏️&nbsp;할일 수정 </span>
        </Button>
      </form>
    </>
  );
}

export default Edit;
