import { useEffect, useState } from "react";
import { ModalForm } from "./Modal/ModalForm";
import { DatabaseService } from "../lib/dbClass";

type props = {
  currentBoard: number;
  setCurrentBoard: (id: number) => void;
  handleCreateBoard: (
    type: "board" | "collection" | "task",
    name: string
  ) => void;
  reloadList?: boolean;
  setReloadList: (reload: boolean) => void;
  contextMenu: (e: React.MouseEvent, boardId: number) => void;
  setShowConfig: (show: boolean) => void;
};

export function Tabs({
  currentBoard,
  setCurrentBoard,
  setReloadList,
  handleCreateBoard,
  contextMenu,
  setShowConfig,
  reloadList
}: props) {
  const dbService = new DatabaseService()
  const [allBoards, setAllBoards] = useState<{ id: number, name: string }[]>([{ id: 0, name: "test"}]);

  useEffect(() => {
    async function fetchBoards() {
      setAllBoards(await dbService.getAllBoards())
    }
    fetchBoards()
}, [reloadList])
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          {allBoards.map((board) => (
            <button
              id="two_one-step"
              key={board.id}
              onContextMenu={(e) => {
                contextMenu(e, board.id);
              }}
              onClick={() => {
                setCurrentBoard(board.id);
                setReloadList(true);
              }}
              style={{
                display: "inline-block",
                float: "left",
                height: "34px",
                minWidth: "80px",
                textAlign: "center",
                lineHeight: "22px",
                padding: "0 8px 0 8px",
                margin: "1px 0px 0px 0px",
                border: "1px solid gray",
                borderBottom:
                  currentBoard === board.id
                    ? "1px solid white"
                    : "1px solid gray",
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
                background: currentBoard === board.id ? "white" : "#F0F0F0",
                cursor: "pointer",
              }}
            >
              {board.name}
            </button>
          ))}
          <ModalForm id="two-step" type="board" onCreate={handleCreateBoard} />
        </div>
      </div>
      <span
        onClick={() => {
          setShowConfig(true);
        }}
        className="flex h-7 w-7 cursor-pointer flex-row-reverse justify-self-end"
      >
        <img src="/icons/config.svg" className="dark:invert" />
      </span>
    </>
  );
}
