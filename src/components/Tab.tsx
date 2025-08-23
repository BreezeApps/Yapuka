import { useEffect, useState } from "react";
import { ModalForm } from "./Modal/ModalForm";
import { DatabaseService } from "../lib/db/dbClass";
import { Board } from "@/lib/types/Board";
import { getTextColor } from "@/lib/utils";

type props = {
  dbService: DatabaseService;
  currentBoard: number;
  setCurrentBoard: (id: number) => void;
  handleCreateBoard: (
    _type: "board" | "collection" | "task",
    name: string,
    _description?: string,
    _date?: Date,
    color?: string,
    _collection_id?: string,
    _id?: number
  ) => void;
  reloadList?: boolean;
  setReloadList: (reload: boolean) => void;
  contextMenu: (e: React.MouseEvent, boardId: number) => void;
  setShowConfig: (show: boolean) => void;
};

/**
 * The Tabs component renders a list of boards with options for context menu, board
 * selection, and configuration settings.
 */
export function Tabs({
  dbService,
  currentBoard,
  setCurrentBoard,
  setReloadList,
  handleCreateBoard,
  contextMenu,
  setShowConfig,
  reloadList,
}: props) {
  const [allBoards, setAllBoards] = useState<Board[]>([
    { id: 0, name: "test", color: "0" },
  ]);

  useEffect(() => {
    async function fetchBoards() {
      setAllBoards(await dbService.getAllBoards());
    }
    fetchBoards();
  }, [reloadList]);
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-x-auto">
            {Array.isArray(allBoards) &&
              allBoards.map((board) => (
                <button
                  key={board.id}
                  onContextMenu={(e) => contextMenu(e, board.id)}
                  onClick={() => {
                    setCurrentBoard(board.id);
                    setReloadList(true);
                  }}
                  style={{
                    height: "34px",
                    minWidth: "80px", // largeur minimale
                    maxWidth: "200px", // largeur max
                    flex: "1 1 auto", // occupe l’espace dispo et peut se réduire
                    textAlign: "center",
                    lineHeight: "22px",
                    padding: "0 8px",
                    margin: "1px 0 0 0",
                    border: "1px solid gray",
                    borderBottom:
                      currentBoard === board.id
                        ? "0px solid var(--color-gray-800)"
                        : "1px solid var(--color-gray-950)",
                    borderTopLeftRadius: "6px",
                    borderTopRightRadius: "6px",
                    cursor: "pointer",
                    background:
                      board.color === null
                        ? "var(--color-gray-900)"
                        : board.color,
                    color: getTextColor(
                      board?.color !== null ? board.color : "#101828"
                    ),
                    whiteSpace: "nowrap", // évite le retour à la ligne
                    overflow: "hidden",
                    textOverflow: "ellipsis", // points de suspension si le texte est trop long
                  }}
                >
                  {board.name}
                </button>
              ))}
            <ModalForm
              id="two-step"
              type="board"
              onCreate={handleCreateBoard}
            />
          </div>
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
