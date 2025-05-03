import { ModalForm } from "./Modal/ModalForm";

type props = {
  tabs: { id: number; name: string }[];
  currentBoard: number;
  setCurrentBoard: (id: number) => void;
  handleCreateBoard: (name: string) => void;
  reloadList?: boolean;
  setReloadList: (reload: boolean) => void;
  contextMenu: (e: React.MouseEvent, boardId: number) => void;
};

export function Tabs({
  tabs,
  currentBoard,
  setCurrentBoard,
  setReloadList,
  handleCreateBoard,
  contextMenu
}: props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {tabs.map((board) => (
          <button
            key={board.id}
            onContextMenu={(e) => {contextMenu(e, board.id)}}
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
        <ModalForm type="board" onCreate={handleCreateBoard} />
      </div>
    </div>
  );
}
