const { ipcRenderer } = require("electron");
// const { Menu, MenuItem } = remote;
require("./theme.js");

// Charger les listes et les tâches au démarrage
window.onload = async () => {
  const lists = await ipcRenderer.invoke("get-lists");
  lists.forEach(async (list) => {
    const listElement = addNewList(list.name, list.color, list.id);
    const tasks = await ipcRenderer.invoke("get-tasks", list.id);
    tasks.forEach((task) => {
      addNewTask(listElement, task.name, task.id);
    });
  });
};

// Ajouter une nouvelle liste
document.getElementById("add-list-btn").addEventListener("click", async () => {
  const createListModal = document.getElementById("create-liste-modal");
  createListModal.classList.remove("hidden");
});
document.getElementById("close-create-list-modal").addEventListener("click", async () => {
    const createListModal = document.getElementById("create-liste-modal");
    createListModal.classList.add("hidden");
  });

  document.getElementById("close-modify-list-modal").addEventListener("click", async () => {
    const modifyListModal = document.getElementById("modify-liste-modal");
    modifyListModal.classList.add("hidden");
  });

document.getElementById("close-create-task-modal").addEventListener("click", async () => {
    const createListModal = document.getElementById("create-task-modal");
    createListModal.classList.add("hidden");
  });

document.getElementById("submit-create-liste").addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name-list").value;
    const color = document.getElementById("color-list").value;

    const result = await ipcRenderer.invoke("add-list", name, color);
    addNewList(name, color, result.id);

    document.getElementById("submit-create-liste").reset();

    const createListModal = document.getElementById("create-liste-modal");
    createListModal.classList.add("hidden");
  });

  document.getElementById("submit-modify-liste").addEventListener("submit", async function (event) {
    event.preventDefault();
    const id = document.getElementById("id-modify-list").value;
    const name = document.getElementById("name-modify-list").value;
    const color = document.getElementById("color-modify-list").value;

    const result = await ipcRenderer.invoke("update-list", id, name, color);
    
    document.getElementById("submit-modify-liste").reset();
    
    document.getElementById("list-" + id).remove();
    const listElement = addNewList(name, color, id);
    const tasks = await ipcRenderer.invoke("get-tasks", id);
    tasks.forEach((task) => {
      addNewTask(listElement, task.name, task.id);
    });

    const createListModal = document.getElementById("modify-liste-modal");
    createListModal.classList.add("hidden");
  });

document.getElementById("submit-create-task").addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name-task").value;
    const description = document.getElementById("description-task").value;
    const date = document.getElementById("date-task").value
    console.log(date)
    const listId = document.getElementById("list-id-task").value;

    const result = await ipcRenderer.invoke(
      "add-task",
      listId,
      description,
      date,
      name,
    );

    const listElement = document.getElementById("list-" + listId);
    addNewTask(listElement, name, result.id);

    document.getElementById("submit-create-task").reset();

    const createTaskModal = document.getElementById("create-task-modal");
    createTaskModal.classList.add("hidden");
  });

document.getElementById("close-description-modal").addEventListener("click", async () => {
    const descriptionModal = document.getElementById("description-modal");
    descriptionModal.classList.add("hidden");
  });
document.getElementById("close-description-modal-foot").addEventListener("click", async () => {
    const descriptionModal = document.getElementById("description-modal");
    descriptionModal.classList.add("hidden");
  });

function addNewList(name, color, id) {
  const listContainer = document.getElementById("lists-container");

  const newList = document.createElement("div");
  newList.className =
    "relative flex flex-col rounded-lg bg-gray-300 shadow-sm border border-slate-200 min-w-[240px] gap-1 p-1.5 list float-left inline";

    const modifyListIconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    modifyListIconSvg.setAttribute("fill", "none");
    modifyListIconSvg.setAttribute("viewbox", "0 0 24 24");
    modifyListIconSvg.setAttribute("stroke-width", "1.5");
    modifyListIconSvg.setAttribute("stroke", "currentcolor");
    modifyListIconSvg.classList.add("w-6");
    modifyListIconSvg.classList.add("h-6");
  
    const modifyListIconPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    modifyListIconPath.setAttribute(
      "d",
      "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
    );
    modifyListIconPath.setAttribute("stroke-linecap", "round")
    modifyListIconPath.setAttribute("stroke-linejoin", "round")
  
    modifyListIconSvg.appendChild(modifyListIconPath);
  
    const modifyListBtn = document.createElement("button");
    modifyListBtn.className =
      "inline-block ml-auto place-items-center justify-self-end rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
    modifyListBtn.appendChild(modifyListIconSvg);
    modifyListBtn.addEventListener("click", async () => {
      const list = await ipcRenderer.invoke("get-list", id)

      document.getElementById("id-modify-list").value = list[0].id
      document.getElementById("name-modify-list").value = list[0].name
      document.getElementById("color-modify-list").value = list[0].color
      const modifyListModal = document.getElementById("modify-liste-modal");
      modifyListModal.classList.remove("hidden");
      // await ipcRenderer.invoke("modify-list", listid);
    });

    const listHeader = document.createElement("h3");
  listHeader.innerText = name;
  listHeader.appendChild(modifyListBtn)
  listHeader.className = "rounded capitalize text-center";
  listHeader.style.background = color;
  newList.appendChild(listHeader);

  const btnList = document.createElement("div");
  btnList.className = "overflow-hidden";

  const deleteListBtn = document.createElement("button");
  deleteListBtn.innerText = "Supprimer la liste";
  deleteListBtn.className =
    "w-1/2 h-16 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l float-left inline";
  deleteListBtn.addEventListener("click", async () => {
    if (confirm("Are you sure !") == true) {
      await ipcRenderer.invoke("delete-list", id);
      newList.remove();
    }
  });
  btnList.appendChild(deleteListBtn);

  const addTaskBtn = document.createElement("button");
  addTaskBtn.innerText = "Ajouter une tâche";
  addTaskBtn.className =
    "w-1/2 h-16 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r float-left inline";
  addTaskBtn.addEventListener("click", async () => {
    document.getElementById("list-id-task").value = id;
    const createTaskModal = document.getElementById("create-task-modal");
    createTaskModal.classList.remove("hidden");
  });
  btnList.appendChild(addTaskBtn);

  newList.appendChild(btnList);

  const taskContainer = document.createElement("div");
  taskContainer.className = "task-container";
  newList.appendChild(taskContainer);

  listContainer.appendChild(newList);

  // newList.addEventListener("click", async function (event) {
  //   const createListModal = document.getElementById("create-liste-modal");
  //   createListModal.classList.remove("hidden");
  // });

  Sortable.create(taskContainer, {
    group: "shared",
    animation: 150,
    onEnd: async (evt) => {
      const taskId = evt.item.id;
      const newPosition = evt.newIndex;
      const newListId = evt.to.closest(".list").id; // Identifier la nouvelle liste
      // Mettre à jour la position et la liste dans la base de données
      await ipcRenderer.invoke(
        "update-task-list-and-position",
        taskId,
        newListId,
        newPosition,
      );
    },
  });

  newList.id = "list-" + id; // Stocker l'ID de la liste dans l'élément DOM

  return newList;
}

function addNewTask(listElement, taskName, taskId) {
  const taskContainer = listElement.querySelector(".task-container");

  const newTask = document.createElement("div");
  newTask.className =
    "text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100";
  newTask.role = "button";
  newTask.id = "task-" + taskId;
  newTask.innerText = taskName;

  const deleteTaskIconSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  deleteTaskIconSvg.setAttribute("fill", "currentcolor");
  deleteTaskIconSvg.setAttribute("viewbox", "0 0 24 24");
  deleteTaskIconSvg.classList.add("w-6");
  deleteTaskIconSvg.classList.add("h-6");

  const deleteTaskIconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  deleteTaskIconPath.setAttribute(
    "d",
    "M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z",
  );
  deleteTaskIconPath.setAttribute("fill-rule", "evenodd");
  deleteTaskIconPath.setAttribute("clip-rule", "evenodd");

  deleteTaskIconSvg.appendChild(deleteTaskIconPath);

  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.className =
    "ml-auto grid place-items-center justify-self-end rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
  deleteTaskBtn.appendChild(deleteTaskIconSvg);
  deleteTaskBtn.addEventListener("click", async () => {
    if (confirm("Are you sure !") == true) {
      await ipcRenderer.invoke("delete-task", taskId);
      newTask.remove();
    }
  });

  newTask.appendChild(deleteTaskBtn);

  newTask.addEventListener("click", async function (event) {
    const descriptionModal = document.getElementById("description-modal");
    const descriptionTextModalElement = document.getElementById(
      "description-text-modal",
    );
    const descriptionTitleModalElement = document.getElementById(
      "description-title-modal",
    );
    const task = await ipcRenderer.invoke("get-tasks-withId", taskId);

    descriptionTextModalElement.innerText = task[0].description;
    descriptionTitleModalElement.innerText = task[0].name;
    descriptionModal.classList.remove("hidden");
  });

  taskContainer.appendChild(newTask);
}

// window.addEventListener(
//   "contextmenu",
//   (e) => {
//     e.preventDefault();
//     const menu = new Menu();
//     menu.append(
//       new MenuItem(new MenuItem({ label: "This menu item is always shown", click: function () {
//         alert(`you clicked on ${e.target.id}`);
//       }, })),
//     );
//     if (e.target.id === "p1" || e.target.id === "p3") {
//       menu.append(
//         new MenuItem({
//           label: "This menu is not always shown",
//           click: function () {
//             alert(`you clicked on ${e.target.id}`);
//           },
//         }),
//       );
//     }
//     menu.popup({ window: remote.getCurrentWindow() });
//   },
//   false,
// );

// const config = await ipcRenderer.invoke('get-config');

// const test = document.getElementById('test')
// test.innerHTML = config.get('database.host')

//   function switchDatabase(e) {
//     if (e.target.checked) {
//         localStorage.setItem('theme', 'dark');
//         document.documentElement.classList.add('dark');
//     } else {
//         localStorage.setItem('theme', 'light');
//         document.documentElement.classList.remove('dark')
//     }
// }
