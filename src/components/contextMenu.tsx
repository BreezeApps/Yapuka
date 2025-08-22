import { Item, Menu } from "react-contexify";
import { useTranslation } from "react-i18next";

/* The `ContextMenu` function is a React functional component that defines a context menu with
different options for boards, collections, and tasks. */
function ContextMenu({ handleBoardItemClick, handleCollectionItemClick, handleTaskItemClick } : { handleBoardItemClick: (e: any) => void; handleCollectionItemClick: (e: any) => void, handleTaskItemClick: (e: any) => void }) {
  const { t } = useTranslation();
  return (
    <>
      <Menu id={"board-menu"} animation="scale">
        <Item onClick={handleBoardItemClick} id="edit">
          {t("Modify_the_Tab")}
        </Item>
        <Item onClick={handleBoardItemClick} id="delete">
          {t("Delete_the_Tab")}
        </Item>
        <Item onClick={handleBoardItemClick} id="print">
          {t("Print")}
        </Item>
      </Menu>
      <Menu id={"collection-menu"} animation="scale">
        <Item onClick={handleCollectionItemClick} id="edit">
          {t("Modify_the_List")}
        </Item>
        <Item onClick={handleCollectionItemClick} id="delete">
          {t("Delete_The_List")}
        </Item>
        <Item onClick={handleCollectionItemClick} id="print">
          {t("Print")}
        </Item>
      </Menu>
      <Menu id={"task-menu"} animation="scale">
        <Item onClick={handleTaskItemClick} id="edit">
          {t("Modify_the_Task")}
        </Item>
        <Item onClick={handleTaskItemClick} id="delete">
          {t("Delete_The_Task")}
        </Item>
      </Menu>
    </>
  );
}

export default ContextMenu;
