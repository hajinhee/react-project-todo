import { Button, Chip, Tab, Tabs } from "@mui/material";
import { useRecoilState } from "recoil";
import {
  TodoList__filterCompletedIndexAtom,
  TodoList__sortIndexAtom,
} from "../atoms";
import { useTodosStatus } from "../hooks";
import { Drawer, useDrawerStatus } from "./Edit";
import { useMemo } from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";

function TodosEmpty() {
  return (
    <>
      <div className="flex-1 flex justify-center items-center">
        <div className="grid gap-6">
          <span>
            <span className="text-[color:var(--mui-color-primary-main)]">
              할일
            </span>
            을 입력해주세요.
          </span>
          <Button
            size="large"
            variant="contained"
            component={NavLink}
            to="/write"
          >
            <span className="!pt-1">할일 추가하기</span>
          </Button>
        </div>
      </div>
    </>
  );
}

function TodoListItem({ todo, drawer, toggleCheckBox }) {
  return (
    <>
      <div className="flex gap-1 py-3">
        <Chip
          label={`No.${todo.no}`}
          variant="contained"
          color="primary"
          className="!pt-1"
        />
        <Chip
          label={new Date(todo.performDate).toLocaleString()}
          variant="outlined"
          className="!pt-1"
        />
      </div>
      <div className="flex items-center !rounded-2xl shadow mb-3 sm:mb-6">
        <Button
          className="!rounded-l-2xl flex-shrink-0 flex !items-start"
          color="inherit"
          onClick={() => toggleCheckBox(todo.no)}
        >
          <span
            className={classNames(
              "text-3xl",
              "sm:text-4xl",
              "h-[60px]",
              "sm:h-[80px]",
              "flex",
              "items-center",
              { "text-[#dcdcdc]": todo.checked !== true },
              {
                "text-[color:var(--mui-color-primary-main)]":
                  todo.checked === true,
              }
            )}
          >
            <i className="fa-solid fa-check"></i>
          </span>
        </Button>
        <div className="w-[2px] bg-[#dcdcdc] mr-3 my-4 sd:mr-4 sm:my-5"></div>
        <div className="flex-grow whitespace-pre-wrap leading-loose !my-3 flex items-center text-[14px] sm:text-[16px]">
          {todo.content}
        </div>
        <Button
          className="!rounded-r-2xl flex-shrink-0 flex !items-start"
          color="inherit"
          onClick={() => drawer.open(todo.no)}
        >
          <span className="text-2xl sm:text-3xl h-[60px] sm:h-[80px] flex items-center text-[#dcdcdc]">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </span>
        </Button>
      </div>
    </>
  );
}

function TodoList() {
  const todosStatus = useTodosStatus();
  const drawerStatus = useDrawerStatus();

  const [filterCompletedIndex, setFilterCompletedIndex] = useRecoilState(
    TodoList__filterCompletedIndexAtom
  );

  const [sortIndex, setSortIndex] = useRecoilState(TodoList__sortIndexAtom);

  const filteredTodos = useMemo(() => {
    return filterCompletedIndex === 1
      ? todosStatus.todos.filter((el) => !el.checked)
      : filterCompletedIndex === 2
      ? todosStatus.todos.filter((el) => el.checked)
      : todosStatus.todos;
  }, [filterCompletedIndex, todosStatus.todos]);

  const sortedTodos = useMemo(
    () =>
      [...filteredTodos].sort((a, b) => {
        const performDateA = new Date(a.performDate).getTime();
        const performDateB = new Date(b.performDate).getTime();
        const regDateA = new Date(a.regDate).getTime();
        const regDateB = new Date(b.regDate).getTime();

        return sortIndex === 0
          ? performDateA - performDateB
          : sortIndex === 1
          ? performDateB - performDateA
          : sortIndex === 3
          ? regDateA - regDateB
          : regDateB - regDateA;
      }),
    [sortIndex, filteredTodos]
  );

  return (
    <>
      <Drawer status={drawerStatus} />
      <Tabs
        variant="fullWidth"
        value={filterCompletedIndex}
        onChange={(event, newValue) => setFilterCompletedIndex(newValue)}
      >
        <Tab
          label={
            <span className="flex">
              <i className="fa-solid fa-list-ul"></i>
              <span className="ml-2">전체</span>
            </span>
          }
          value={0}
        />
        <Tab
          label={
            <span className="flex">
              <i className="fa-regular fa-square"></i>
              <span className="ml-2">미완료</span>
            </span>
          }
          value={1}
        />
        <Tab
          label={
            <span className="flex">
              <i className="fa-regular fa-square-check"></i>
              <span className="ml-2">완료</span>
            </span>
          }
          value={2}
        />
      </Tabs>
      <Tabs
        variant="scrollable"
        value={sortIndex}
        onChange={(event, newValue) => {
          setSortIndex(newValue);
        }}
      >
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-regular fa-clock mr-2"></i>
              <span className="mr-2 whitespace-nowrap">급해요</span>
              <i className="fa-solid fa-sort-up relative top-[3px]"></i>
            </span>
          }
          value={0}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-regular fa-clock mr-2"></i>
              <span className="mr-2 whitespace-nowrap">널널해요</span>
              <i className="fa-solid fa-sort-down relative top-[-3px]"></i>
            </span>
          }
          value={1}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-solid fa-pen mr-2"></i>
              <span className="mr-2 whitespace-nowrap">작성순</span>
              <i className="fa-solid fa-sort-up relative top-[3px]"></i>
            </span>
          }
          value={2}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-solid fa-pen mr-2"></i>
              <span className="mr-2 whitespace-nowrap">작성순</span>
              <i className="fa-solid fa-sort-down relative top-[-3px]"></i>
            </span>
          }
          value={3}
        />
      </Tabs>
      <div className="p-5 sm:p-10">
        {sortedTodos.map((el, index) => (
          <TodoListItem
            key={index}
            todo={el}
            drawer={drawerStatus}
            toggleCheckBox={todosStatus.toggleCheckBox}
          />
        ))}
      </div>
    </>
  );
}

function Main() {
  const todosStatus = useTodosStatus();
  if (todosStatus.todos.length === 0) return <TodosEmpty />;

  return (
    <>
      <TodoList />
    </>
  );
}

export default Main;
