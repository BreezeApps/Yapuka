const { ipcRenderer } = require("electron");
const { updateContent, getTranslationWithVar } = require("./i18n.js");

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const downloadButton = document.getElementById('download-button');
ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  message.innerText = 'A new update is available.';
  notification.classList.remove('hidden');
  downloadButton.classList.remove('hidden')
});
ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
  restartButton.classList.remove('hidden');
  notification.classList.remove('hidden');
  downloadButton.classList.add('hidden')
});

function closeNotification() {
  notification.classList.add('hidden');
}
function restartApp() {
  ipcRenderer.send('restart_app');
}
function downloadUpdate() {
  ipcRenderer.send("download_update")
}

function activeButton(id) {
  const button = document.getElementById(id);
  button.removeAttribute("disabled");

  button.classList.remove("bg-indigo-100");
  button.classList.remove("text-indigo-700");
  button.classList.remove("hover:bg-indigo-200");

  button.classList.add("bg-blue-700");
  button.classList.add("hover:bg-blue-800");
  button.classList.add("text-white");
}
function deactiveButton(id) {
  const button = document.getElementById(id);
  button.setAttribute("disabled", "disabled");

  button.classList.add("bg-indigo-100");
  button.classList.add("text-indigo-700");
  button.classList.add("hover:bg-indigo-200");

  button.classList.remove("bg-blue-700");
  button.classList.remove("hover:bg-blue-800");
  button.classList.remove("text-white");
}

function onmodif(element) {
  const elementType = element.id.split("-")[2];
  const elementMod = element.id.split("-")[1];
  if (elementMod === "modify") {
    if (elementType === "task") {
      activeButton("button-submit-modify-task");
    } else if (elementType === "list") {
      activeButton("button-submit-modify-list");
    }
  }
}

// Charger les listes et les tâches au démarrage
window.onload = async () => {
  const lists = await ipcRenderer.invoke("get-lists");
  const blur = await ipcRenderer.invoke("get-blur");
  if (blur[0].value === "1") {
    document.getElementById("blur").classList.add("backdrop-blur-md");
  } else {
    document.getElementById("blur").classList.add("backdrop-blur-none");
  }
  lists.forEach(async (list) => {
    const listElement = addNewList(list.name, list.color, list.id);
    const tasks = await ipcRenderer.invoke("get-tasks", list.id);
    tasks.forEach((task) => {
      addNewTask(listElement, task.name, task.id);
    });
  });
  let theme = await ipcRenderer.invoke("get-theme");
  theme = theme[0].value;
  localStorage.setItem("theme", theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else if (theme === "light") {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }
  setTimeout(function () {
    updateContent();
  }, 500);
};

// let url = document.getElementById('url');
// url.addEventListener('click', async (event) => {
//   const print = await ipcRenderer.invoke("print", "Test")
//   console.log(print)
// });

// Ajout d'un event listener pour afficher le menu contextuel
const contextMenu = document.getElementById("context-menu");
const editButton = document.getElementById("edit-button");
let targetDiv = null;

// Cacher le menu contextuel lors d'un clic en dehors
document.addEventListener("click", (event) => {
  if (!contextMenu.contains(event.target)) {
    contextMenu.classList.add("hidden");
  }
});

// Action lors du clic sur le bouton Modifier
editButton.addEventListener("click", async () => {
  if (targetDiv && targetDiv.id.split("-")[0] === "list_header") {
    editButton.classList.remove("hidden");
    const id = targetDiv.id;
    const list = await ipcRenderer.invoke("get-list", id.split("-")[1]);

    document.getElementById("id-modify-list").value = list[0].id;
    document.getElementById("name-modify-list").value = list[0].name;
    document.getElementById("color-modify-list").value = list[0].color;
    const modifyListModal = document.getElementById("modify-liste-modal");
    modifyListModal.classList.remove("hidden");
    document.getElementById("blur").classList.remove("hidden");
    contextMenu.classList.add("hidden");
  } else {
    editButton.classList.add("hidden");
  }
});

// Ajouter une nouvelle liste
document.getElementById("add-list-btn").addEventListener("click", async () => {
  const createListModal = document.getElementById("create-liste-modal");
  document.getElementById("blur").classList.remove("hidden");
  createListModal.classList.remove("hidden");
  document.getElementById("name-list").focus();
});
document
  .getElementById("close-create-list-modal")
  .addEventListener("click", async () => {
    const createListModal = document.getElementById("create-liste-modal");
    document.getElementById("blur").classList.add("hidden");
    createListModal.classList.add("hidden");
  });

document
  .getElementById("close-modify-list-modal")
  .addEventListener("click", async () => {
    const modifyListModal = document.getElementById("modify-liste-modal");
    document.getElementById("blur").classList.add("hidden");
    modifyListModal.classList.add("hidden");
  });

document
  .getElementById("close-create-task-modal")
  .addEventListener("click", async () => {
    const createListModal = document.getElementById("create-task-modal");
    document.getElementById("blur").classList.add("hidden");
    createListModal.classList.add("hidden");
  });
document
  .getElementById("close-modify-task-modal")
  .addEventListener("click", async () => {
    const modifyListModal = document.getElementById("modify-task-modal");
    document.getElementById("blur").classList.add("hidden");
    modifyListModal.classList.add("hidden");
  });

document
  .getElementById("submit-create-liste")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name-list").value;
    const color = document.getElementById("color-list").value;

    const result = await ipcRenderer.invoke("add-list", name, color);
    addNewList(name, color, result.id);

    const createListModal = document.getElementById("create-liste-modal");
    document.getElementById("blur").classList.add("hidden");
    createListModal.classList.add("hidden");
    updateContent();
  });

document
  .getElementById("submit-modify-liste")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const id = document.getElementById("id-modify-list").value;
    const name = document.getElementById("name-modify-list").value;
    const color = document.getElementById("color-modify-list").value;
    deactiveButton("button-submit-modify-list");

    const result = await ipcRenderer.invoke("update-list", id, name, color);

    // document.getElementById("list-" + id).remove();
    // const listElement = addNewList(name, color, id);
    // const tasks = await ipcRenderer.invoke("get-tasks", id);
    // tasks.forEach((task) => {
    //   addNewTask(listElement, task.name, task.id);
    // });

    const createListModal = document.getElementById("modify-liste-modal");
    document.getElementById("blur").classList.add("hidden");
    createListModal.classList.add("hidden");
    window.location.reload();
  });

document
  .getElementById("submit-create-task")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name-task").value;
    const description = document.getElementById("description-task").value;
    const date = document.getElementById("date-task").value;
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

    const createTaskModal = document.getElementById("create-task-modal");
    document.getElementById("blur").classList.add("hidden");
    createTaskModal.classList.add("hidden");
  });
document
  .getElementById("submit-modify-task")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name-modify-task").value;
    const description = document.getElementById(
      "description-modify-task",
    ).value;
    const date = document.getElementById("date-modify-task").value;
    const listId = document.getElementById("list-id-modify-task").value;
    const taskId = document.getElementById("task-id-modify-task").value;
    deactiveButton("button-submit-modify-task");

    const result = await ipcRenderer.invoke(
      "update-task",
      taskId,
      description,
      date,
      name,
    );

    const updateTaskModal = document.getElementById("modify-task-modal");
    document.getElementById("blur").classList.add("hidden");
    updateTaskModal.classList.add("hidden");
    window.location.reload();
  });

document
  .getElementById("close-description-modal")
  .addEventListener("click", async () => {
    const descriptionModal = document.getElementById("description-modal");
    document.getElementById("blur").classList.add("hidden");
    descriptionModal.classList.add("hidden");
  });
document
  .getElementById("close-description-modal-foot")
  .addEventListener("click", async () => {
    const descriptionModal = document.getElementById("description-modal");
    document.getElementById("blur").classList.add("hidden");
    descriptionModal.classList.add("hidden");
  });

function addNewList(name, color, id) {
  const listContainer = document.getElementById("lists-container");

  const newList = document.createElement("div");
  newList.className =
    "relative flex flex-col rounded-lg bg-gray-300 shadow-sm border border-slate-200 min-w-[240px] gap-1 p-1.5 list float-left inline m-3";

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
  modifyListIconPath.setAttribute("stroke-linecap", "round");
  modifyListIconPath.setAttribute("stroke-linejoin", "round");

  modifyListIconSvg.appendChild(modifyListIconPath);

  const modifyListBtn = document.createElement("button");
  modifyListBtn.className =
    "place-self-end inline-block ml-auto place-items-center rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
  modifyListBtn.appendChild(modifyListIconSvg);
  modifyListBtn.addEventListener("click", async () => {
    const list = await ipcRenderer.invoke("get-list", id);

    document.getElementById("id-modify-list").value = list[0].id;
    document.getElementById("name-modify-list").value = list[0].name;
    document.getElementById("color-modify-list").value = list[0].color;
    const modifyListModal = document.getElementById("modify-liste-modal");
    document.getElementById("blur").classList.remove("hidden");
    document.getElementById("name-modify-list").focus();
    modifyListModal.classList.remove("hidden");
  });

  const btnList = document.createElement("div");
  btnList.className = "overflow-hidden";

  const deleteListBtn = document.createElement("button");
  deleteListBtn.setAttribute("data-i18n", "Delete_list");
  deleteListBtn.className =
    "bg-gray-200 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-l float-left inline";
  deleteListBtn.addEventListener("click", async () => {
    if (
      confirm(
        getTranslationWithVar("Are_Sure", { title: name.toUpperCase() }),
      ) == true
    ) {
      await ipcRenderer.invoke("delete-list", id);
      newList.remove();
    }
  });
  btnList.appendChild(deleteListBtn);

  const addTaskBtn = document.createElement("button");
  addTaskBtn.setAttribute("data-i18n", "Add_a_Task");
  addTaskBtn.className =
    "bg-gray-200 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-r float-left inline";
  addTaskBtn.addEventListener("click", async () => {
    document.getElementById("list-id-task").value = id;
    const createTaskModal = document.getElementById("create-task-modal");
    // const editor = new EditorJS({
    //   holder : '#editorjs',
    //   tools: {
    //     header: Header,
    //     linkTool: LinkTool,
    //     image: SimpleImage,
    //     checklist: Checklist
    //   },
    //   onReady: () => {
    //     console.log('Editor.js is ready to work!')
    //  }
    // })
    document.getElementById("blur").classList.remove("hidden");
    createTaskModal.classList.remove("hidden");
    document.getElementById("name-task").focus();
  });
  btnList.appendChild(addTaskBtn);

  const listHeader = document.createElement("h3");
  listHeader.innerText = name;
  listHeader.appendChild(modifyListBtn);
  listHeader.className = "rounded capitalize text-center p-2 font-bold";
  listHeader.style.background = color;
  listHeader.id = "list_header-" + id;
  listHeader.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const contextMenu = document.getElementById("context-menu");
    targetDiv = event.target;

    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.classList.remove("hidden");
  });
  listHeader.appendChild(btnList);
  newList.appendChild(listHeader);

  const taskContainer = document.createElement("div");
  taskContainer.className = "task-container";
  newList.appendChild(taskContainer);

  listContainer.appendChild(newList);

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
  newTask.className = // p-2 pl-3
    "text-slate-800 flex w-full items-center rounded-md transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100";
  newTask.role = "button";
  newTask.id = "task-" + taskId;
  newTask.innerText = taskName;

  const modifyTaskIconSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  modifyTaskIconSvg.setAttribute("fill", "none");
  modifyTaskIconSvg.setAttribute("viewbox", "0 0 24 24");
  modifyTaskIconSvg.setAttribute("stroke-width", "1.5");
  modifyTaskIconSvg.setAttribute("stroke", "currentcolor");
  modifyTaskIconSvg.classList.add("w-6");
  modifyTaskIconSvg.classList.add("h-6");

  const modifyTaskIconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  modifyTaskIconPath.setAttribute(
    "d",
    "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
  );
  modifyTaskIconPath.setAttribute("stroke-linecap", "round");
  modifyTaskIconPath.setAttribute("stroke-linejoin", "round");

  modifyTaskIconSvg.appendChild(modifyTaskIconPath);

  const modifyTaskBtn = document.createElement("button");
  modifyTaskBtn.className = // p-[0.1px]
    "inline-block ml-auto place-items-center rounded-md border border-transparent text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
  modifyTaskBtn.appendChild(modifyTaskIconSvg);
  modifyTaskBtn.addEventListener("click", async () => {
    document.getElementById("description-modal").classList.add("hidden");
    const task = await ipcRenderer.invoke("get-tasks-withId", taskId);

    document.getElementById("task-id-modify-task").value = taskId;
    document.getElementById("name-modify-task").value = task[0].name;
    document.getElementById("date-modify-task").value = task[0].date;
    document.getElementById("description-modify-task").value =
      task[0].description;
    document.getElementById("list-id-modify-task").value =
      listElement.id.split("-")[1];
    const modifyTaskModal = document.getElementById("modify-task-modal");
    document.getElementById("blur").classList.remove("hidden");
    document.getElementById("name-modify-task").focus();
    modifyTaskModal.classList.remove("hidden");
  });

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
    "ml-auto grid place-items-center justify-self-end rounded-md border border-transparent p-[0.1px] text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
  deleteTaskBtn.appendChild(deleteTaskIconSvg);
  deleteTaskBtn.addEventListener("click", async () => {
    document.getElementById("description-modal").classList.add("hidden");
    if (
      confirm(
        getTranslationWithVar("Are_Sure", { title: taskName.toUpperCase() }),
      ) == true
    ) {
      await ipcRenderer.invoke("delete-task", taskId);
      newTask.remove();
    }
  });

  newTask.appendChild(modifyTaskBtn);
  newTask.appendChild(deleteTaskBtn);

  newTask.addEventListener("click", async function (event) {
    setTimeout(async () => {
      if (
        document
          .getElementById("description-modal")
          .classList.contains("hidden")
      ) {
        if (
          document
            .getElementById("modify-task-modal")
            .classList.contains("hidden")
        ) {
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
          document.getElementById("blur").classList.remove("hidden");
          descriptionModal.classList.remove("hidden");
        }
      }
    }, 500);
  });

  taskContainer.appendChild(newTask);
}

async function go_config_window() {
  const list = await ipcRenderer.invoke("config-window");
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
