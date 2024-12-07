// import { ipcRenderer } from "electron";
import { getTranslation, getTranslationWithVar, updateContent } from "./i18n";
import Sortable from "sortablejs";

// ipcRenderer.on('inject-code', (_event, code) => {
//   try {
//     eval(code);
//   } catch (error) {
//     console.error("Erreur lors de l'injection de code du plugin :", error);
//   }
// })
await window.ipc.injectCode((code) => {
  try {
    eval(code);
  } catch (error) {
    console.error("Erreur lors de l'injection de code du plugin :", error);
  }
})
export async function getVersion() {
  const version = await window.ipc.getAppVersion()
  return version
}

// ipcRenderer.on('pdfLink', function (_evt, link, name) {
//   setTimeout(() => {
//     var link_Element = document.createElement("a");
//     link_Element.download = name;
//     link_Element.href = link;
//     link_Element.click();
//     link_Element.remove();
//   }, 500)
// })

await window.ipc.pdfLink((link, name) => {
  setTimeout(() => {
    var link_Element = document.createElement("a");
    link_Element.download = name;
    link_Element.href = link;
    link_Element.click();
    link_Element.remove();
  }, 500)
})

document.getElementById("print-tab-btn")?.addEventListener("click", async (_event) => {
  await window.ipc.printer("tab", document.body.id)
})

const notification = document.getElementById("notification")!;
const message = document.getElementById("message")!;
const restartButton = document.getElementById("restart-button")!;
const downloadButton = document.getElementById("download-button")!;

export async function checkUpdate() {
  const currentVersion = await getVersion()
  const update = await window.ipc.checkUpdate();
  if (update !== null && currentVersion !== update.versionInfo.version) {
    const msg = "<span data-i18n='update_Available' />\n" + currentVersion + " >> " + update.versionInfo.version

    message.innerHTML = msg
    notification?.classList.remove("hidden");
    downloadButton?.classList.remove("hidden");
  }
}

await window.ipc.updateDownloaded((_event) => {
  message.innerHTML = "<span data-i18n='update_Downloaded' />";
  restartButton?.classList.remove("hidden");
  notification?.classList.remove("hidden");
  downloadButton?.classList.add("hidden");
})

// ipcRenderer.on("update_downloaded", () => {
//   ipcRenderer.removeAllListeners("update_downloaded");
//   message.innerHTML = "<span data-i18n='update_Downloaded' />";
//   restartButton?.classList.remove("hidden");
//   notification?.classList.remove("hidden");
//   downloadButton?.classList.add("hidden");
// });

export function closeNotification() {
  notification?.classList.add("hidden");
}
export async function restartApp() {
  await window.ipc.restartApp()
}
export async function downloadUpdate() {
  await window.ipc.downloadUpdate()
}

export function activeButton(id) {
  const button = document.getElementById(id);
  button?.removeAttribute("disabled");

  button?.classList.remove("bg-indigo-100");
  button?.classList.remove("text-indigo-700");
  button?.classList.remove("hover:bg-indigo-200");

  button?.classList.add("bg-blue-700");
  button?.classList.add("hover:bg-blue-800");
  button?.classList.add("text-white");
}
export function deactiveButton(id) {
  const button = document.getElementById(id);
  button?.setAttribute("disabled", "disabled");

  button?.classList.add("bg-indigo-100");
  button?.classList.add("text-indigo-700");
  button?.classList.add("hover:bg-indigo-200");

  button?.classList.remove("bg-blue-700");
  button?.classList.remove("hover:bg-blue-800");
  button?.classList.remove("text-white");
}

export function onmodif(event: React.ChangeEvent<HTMLInputElement>): void {
  const elementType = event.currentTarget.id.split("-")[2];
  const elementMod = event.currentTarget.id.split("-")[1];
  if (elementMod === "modify") {
    if (elementType === "task") {
      activeButton("button-submit-modify-task");
    } else if (elementType === "list") {
      activeButton("button-submit-modify-list");
    }
  }
}

export function onmodifarea(event: React.ChangeEvent<HTMLTextAreaElement>): void {
  const elementType = event.target.id.split("-")[2];
  const elementMod = event.target.id.split("-")[1];
  if (elementMod === "modify") {
    if (elementType === "task") {
      activeButton("button-submit-modify-task");
    } else if (elementType === "list") {
      activeButton("button-submit-modify-list");
    }
  }
}

export async function changeTab(tabid) {
  await window.location.replace("index.html?tab=" + tabid);
}

window.onload = async () => {
  await checkUpdate()
  const tabs = await window.ipc.getTabs()
  if (getURLParameter("tab") === null) {
    document.body.id = tabs[0].id.toString();
  } else {
    const verif_tab = await window.ipc.getTab(await getURLParameter("tab"))
    if (verif_tab[0] === null) {
      document.body.id = tabs[0].id.toString();
    } else {
      document.body.id = getURLParameter("tab")?.toString()!;
    }
  }
  let list_tabs = document.createElement("select");
  list_tabs.setAttribute("onchange", "changeTab(this.value)");
  list_tabs.classList.add(
    "mt-1",
    "block",
    "rounded-md",
    "border-2",
    "border-gray-300",
    "shadow-sm",
    "focus:border-indigo-300",
    "focus:ring",
    "focus:ring-indigo-200",
    "focus:ring-opacity-50",
  );
  const tabsElement = document.getElementById("tabs")
  tabs.forEach((tab) => {
    let list_tab = document.createElement("option");
    if (document.body.id == tab.id.toString()) {
      list_tab.setAttribute("selected", "true")
    }
    list_tab.value = tab.id.toString()
    list_tab.innerText = tab.name;
    list_tabs.appendChild(list_tab);
  });
  tabsElement?.appendChild(list_tabs)
  const lists = window.ipc.getLists(document.body.id)
  const blur = window.ipc.getBlur();
  if (blur[0].value === "1") {
    document.getElementById("blur")?.classList.add("backdrop-blur-md");
  } else {
    document.getElementById("blur")?.classList.add("backdrop-blur-none");
  }
  lists.forEach(async (list) => {
    const listElement = addNewList(list.name, list.color, list.id);
    const tasks = window.ipc.getTasks(list.id.toString());
    tasks.forEach((task) => {
      addNewTask(listElement, task.name, task.id);
    });
  });
  let theme = window.ipc.getTheme().value;
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
    updateContent()
  }, 500);
};

async function getURLParameter(sParam) {
  const sPageURL = await window.location.search.substring(1);
  const sURLVariables = sPageURL.split("&");
  for (let i = 0; i < sURLVariables.length; i++) {
    const sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] === sParam) {
      return decodeURIComponent(sParameterName[1] || "");
    }
  }
  return "null";
}
// let url = document.getElementById('url');
// url.addEventListener('click', async (event) => {
//   const print = await ipcRenderer.invoke("print", "Test")
//   console.log(print)
// });

// Ajout d'un event listener pour afficher le menu contextuel
const contextMenu = document.getElementById("context-menu");
const editButton = document.getElementById("edit-button");
let targetDiv: HTMLElement = document.getElementById("div")!;

// Cacher le menu contextuel lors d'un clic en dehors
document.addEventListener("click", (event) => {
  if (event.target instanceof Node && !contextMenu?.contains(event.target)) {
    contextMenu?.classList.add("hidden");
  }
});

// Action lors du clic sur le bouton Modifier
editButton?.addEventListener("click", async () => {
  if (typeof(targetDiv) != null) {
    if (typeof(targetDiv) != null && targetDiv?.id.split("-")[0] === "list_header") {
      editButton.classList.remove("hidden");
      const id = targetDiv.id;
      const list = await window.ipc.getList(id.split("-")[1]);

      const id_modify_list: HTMLInputElement = document.getElementById("id-modify-list") as HTMLInputElement;
      const name_modify_list: HTMLInputElement = document.getElementById("name-modify-list") as HTMLInputElement;
      const color_modify_list: HTMLInputElement = document.getElementById("color-modify-list") as HTMLInputElement;
  
      id_modify_list.value = list[0].id;
      name_modify_list.value = list[0].name;
      color_modify_list.value = list[0].color;
      const modifyListModal = document.getElementById("modify-liste-modal");
      modifyListModal?.classList.remove("hidden");
      document.getElementById("blur")?.classList.remove("hidden");
      contextMenu?.classList.add("hidden");
    } else {
      editButton.classList.add("hidden");
    }
  }
});

// Ajouter une nouvelle liste
document.getElementById("add-list-btn")?.addEventListener("click", async () => {
  const createListModal = document.getElementById("create-liste-modal");
  document.getElementById("blur")?.classList.remove("hidden");
  createListModal?.classList.remove("hidden");
  document.getElementById("name-list")?.focus();
});

document.getElementById("add-tab-btn")?.addEventListener("click", async () => {
  const createTabModal = document.getElementById("create-tab-modal");
  document.getElementById("blur")?.classList.remove("hidden");
  createTabModal?.classList.remove("hidden");
  document.getElementById("name-tab")?.focus();
});

document.getElementById("modify-tab-btn")?.addEventListener("click", async () => {
  const info = await window.ipc.getTab(document.body.id)
  const name_modify_tab = document.getElementById("name-modify-tab") as HTMLInputElement
  name_modify_tab.value = info[0].name
  const createTabModal = document.getElementById("modify-tab-modal");
  document.getElementById("blur")?.classList.remove("hidden");
  createTabModal?.classList.remove("hidden");
  document.getElementById("name-modify-tab")?.focus();
});
document.getElementById("delete-tab-btn")?.addEventListener("click", async () => {
  const tab = await window.ipc.getTab(document.body.id)
  if (
    confirm(
      await getTranslationWithVar("Are_Sure", { title: tab[0].name.toUpperCase(), type: await getTranslation("tab") }),
    ) == true
  ) {
    const lists = await window.ipc.getLists(document.body.id)
    lists.forEach(async list => {
      const tasks = await window.ipc.getTasks(list.id.toString())
      tasks.forEach(async task => {
        await window.ipc.deleteTask(task.id.toString())
      })
      await window.ipc.deleteList(list.id.toString())
    })
    await window.ipc.deleteTab(document.body.id)
    await window.location.reload()
  }
})
document.getElementById("close-create-list-modal")?.addEventListener("click", async () => {
    const createListModal = document.getElementById("create-liste-modal");
    document.getElementById("blur")?.classList.add("hidden");
    createListModal?.classList.add("hidden");
  });

document.getElementById("close-create-tab-modal")?.addEventListener("click", async () => {
    const createTabModal = document.getElementById("create-tab-modal");
    document.getElementById("blur")?.classList.add("hidden");
    createTabModal?.classList.add("hidden");
  });

document.getElementById("close-modify-list-modal")?.addEventListener("click", async () => {
    const modifyListModal = document.getElementById("modify-liste-modal");
    document.getElementById("blur")?.classList.add("hidden");
    modifyListModal?.classList.add("hidden");
  });

document.getElementById("close-modify-tab-modal")?.addEventListener("click", async () => {
    const modifyListModal = document.getElementById("modify-tab-modal");
    document.getElementById("blur")?.classList.add("hidden");
    modifyListModal?.classList.add("hidden");
  });

document.getElementById("close-create-task-modal")?.addEventListener("click", async () => {
    const createListModal = document.getElementById("create-task-modal");
    document.getElementById("blur")?.classList.add("hidden");
    createListModal?.classList.add("hidden");
  });
document.getElementById("close-modify-task-modal")?.addEventListener("click", async () => {
    const modifyListModal = document.getElementById("modify-task-modal");
    document.getElementById("blur")?.classList.add("hidden");
    modifyListModal?.classList.add("hidden");
  });

document.getElementById("submit-create-liste")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name_element = document.getElementById("name-list") as HTMLInputElement;
    const name = name_element.value
    const color_element = document.getElementById("color-list") as HTMLInputElement;
    const color = color_element.value
    const tab_id = document.body.id;
    if (name !== null) {
      const result = await window.ipc.addList(tab_id, name, color);
      addNewList(name, color, result.id);

      const createListModal = document.getElementById("create-liste-modal");
      document.getElementById("blur")?.classList.add("hidden");
      createListModal?.classList.add("hidden");
      updateContent();
    }
  });

document.getElementById("submit-create-tab")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name_element = document.getElementById("name-tab") as HTMLInputElement;
    const name = name_element.value
    if (name !== null) {
      const result = await window.ipc.addTab(name)
      updateContent();
      await window.location.replace("index.html?tab=" + result.id);
    }
  });

document.getElementById("submit-modify-liste")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const id_element = document.getElementById("id-modify-list") as HTMLInputElement;
    const id = id_element.value
    const name_element = document.getElementById("name-modify-list") as HTMLInputElement;
    const name = name_element.value
    const color_element = document.getElementById("color-modify-list") as HTMLInputElement;
    const color = color_element.value

    if (name !== null) {
      deactiveButton("button-submit-modify-list");
      await window.ipc.updateList(id, name, color)
      const createListModal = document.getElementById("modify-liste-modal");
      document.getElementById("blur")?.classList.add("hidden");
      createListModal?.classList.add("hidden");
      await window.location.reload();
    }
  });

document.getElementById("submit-modify-tab")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const id = document.body.id;
    const name_element = document.getElementById("name-modify-tab") as HTMLInputElement;
    const name = name_element.value

    if (name !== null) {
      deactiveButton("button-submit-modify-tab");
      await window.ipc.updateTab(id, name)
      const createTabModal = document.getElementById("modify-tab-modal");
      document.getElementById("blur")?.classList.add("hidden");
      createTabModal?.classList.add("hidden");
      await window.location.reload();
    }
  });

document.getElementById("submit-create-task")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name_element = document.getElementById("name-task") as HTMLInputElement;
    const name = name_element.value
    const description_element = document.getElementById("description-task") as HTMLInputElement;
    const description = description_element.value
    const date_element = document.getElementById("date-task") as HTMLInputElement;
    const date = date_element.value
    const listId_element = document.getElementById("list-id-task") as HTMLInputElement;
    const listId = listId_element.value

    if (name !== null) {
      const create_task_form = document.getElementById("submit-create-task") as HTMLFormElement;
      create_task_form.reset()
      const result = await window.ipc.addTask(listId, description, date, name)
      const listElement = document.getElementById("list-" + listId);
      addNewTask(listElement, name, result.id);
      const createTaskModal = document.getElementById("create-task-modal");
      document.getElementById("blur")?.classList.add("hidden");
      createTaskModal?.classList.add("hidden");
    }
  });
document.getElementById("submit-modify-task")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name_element = document.getElementById("name-modify-task") as HTMLInputElement;
    const name = name_element.value
    const description_element = document.getElementById(
      "description-modify-task",
    ) as HTMLInputElement;
    const description = description_element.value
    const date_element = document.getElementById("date-modify-task") as HTMLInputElement;
    const date = date_element.value
    // const listId_element = document.getElementById("list-id-modify-task") as HTMLInputElement;
    // const listId = listId_element.value
    const taskId_element = document.getElementById("task-id-modify-task") as HTMLInputElement;
    const taskId = taskId_element.value
    if (name !== null) {
      deactiveButton("button-submit-modify-task");
      await window.ipc.updateTask(taskId, description, date, name)
      const updateTaskModal = document.getElementById("modify-task-modal");
      document.getElementById("blur")?.classList.add("hidden");
      updateTaskModal?.classList.add("hidden");
      await window.location.reload();
    }
  });

document.getElementById("close-description-modal")?.addEventListener("click", async () => {
    const descriptionModal = document.getElementById("description-modal");
    document.getElementById("blur")?.classList.add("hidden");
    descriptionModal?.classList.add("hidden");
  });
document.getElementById("close-description-modal-foot")?.addEventListener("click", async () => {
    const descriptionModal = document.getElementById("description-modal");
    document.getElementById("blur")?.classList.add("hidden");
    descriptionModal?.classList.add("hidden");
  });

export function addNewList(name, color, id) {
  const listContainer = document.getElementById("lists-container");

  const newList = document.createElement("div");
  newList.className =
    "relative flex flex-col rounded-lg bg-gray-300 shadow-sm border border-slate-200 min-w-[240px] gap-1 p-1.5 list float-left inline m-3";

    const printListIcon = document.createElement("img")
    printListIcon.setAttribute("src", "../../build/img/icons/print-icon.svg")
    printListIcon.classList.add("h-6");
  
    const printListBtn = document.createElement("button");
    printListBtn.className =
      "place-self-end inline-block ml-auto place-items-center rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
    printListBtn.appendChild(printListIcon);
    printListBtn.addEventListener("click", async () => {
      await window.ipc.printer("list", id)
    });

  const modifyListIcon = document.createElement("img")
  modifyListIcon.src = "../../build/img/icons/modify.svg"
  modifyListIcon.classList.add("w-6", "h-6")

  const modifyListBtn = document.createElement("button");
  modifyListBtn.className =
    "place-self-end inline-block ml-auto place-items-center rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
  modifyListBtn.appendChild(modifyListIcon);
  modifyListBtn.addEventListener("click", async () => {
    const list = await window.ipc.getList(id)

    const id_modify_list = document.getElementById("id-modify-list") as HTMLInputElement
    id_modify_list.value = list[0].id;

    const name_modify_list = document.getElementById("name-modify-list") as HTMLInputElement
    name_modify_list.value = list[0].name;

    const color_modify_list = document.getElementById("color-modify-list") as HTMLInputElement
    color_modify_list.value = list[0].color;

    const modifyListModal = document.getElementById("modify-liste-modal");
    document.getElementById("blur")?.classList.remove("hidden");
    document.getElementById("name-modify-list")?.focus();
    modifyListModal?.classList.remove("hidden");
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
        await getTranslationWithVar("Are_Sure", { title: name.toUpperCase(), type: await getTranslation("list") }),
      ) == true
    ) {
      const tasks = await window.ipc.getTasks(id)
      tasks.forEach(async task => {
        await window.ipc.deleteTask(task.id.toString())
      })
      await window.ipc.deleteList(id)
      newList.remove();
    }
    document.getElementById("description-modal")?.classList.add("hidden");
  });
  btnList.appendChild(deleteListBtn);

  const addTaskBtn = document.createElement("button");
  addTaskBtn.setAttribute("data-i18n", "Add_a_Task");
  addTaskBtn.className =
    "bg-gray-200 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-r float-left inline";
  addTaskBtn.addEventListener("click", async () => {
    const list_id_task = document.getElementById("list-id-task") as HTMLInputElement
    list_id_task.value = id;

    const createTaskModal = document.getElementById("create-task-modal") as HTMLElement;
    document.getElementById("blur")?.classList.remove("hidden");
    createTaskModal.classList.remove("hidden");
    document.getElementById("name-task")?.focus();
  });
  btnList.appendChild(addTaskBtn);

  const listHeader = document.createElement("h3");
  listHeader.innerText = name;
  listHeader.appendChild(modifyListBtn);
  listHeader.appendChild(printListBtn);
  listHeader.className = "rounded capitalize text-center p-2 font-bold";
  listHeader.style.background = color;
  listHeader.id = "list_header-" + id;
  listHeader.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const contextMenu = document.getElementById("context-menu")!;
    targetDiv = event.target as HTMLElement;

    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.classList.remove("hidden");
  });
  listHeader.appendChild(btnList);
  newList.appendChild(listHeader);

  const taskContainer = document.createElement("div");
  taskContainer.className = "task-container";
  newList.appendChild(taskContainer);

  listContainer?.appendChild(newList);

  Sortable.create(taskContainer, {
    group: "shared",
    animation: 150,
    onEnd: async (evt) => {
      const taskId = evt.item.id.split("-")[1];
      const newPosition = evt.newIndex;
      const newListId = evt.to.closest(".list")?.id.split("-")[1]; // Identifier la nouvelle liste
      // Mettre à jour la position et la liste dans la base de données
      await window.ipc.updateTaskListPosition(taskId, newListId, newPosition?.toString())
    },
  });

  newList.id = "list-" + id; // Stocker l'ID de la liste dans l'élément DOM
  return newList;
}

export function addNewTask(listElement, taskName, taskId) {
  const taskContainer = listElement.querySelector(".task-container");

  const newTask = document.createElement("div");
  newTask.className = // p-2 pl-3
    "text-slate-800 flex w-full items-center rounded-md transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100";
  newTask.role = "button";
  newTask.id = "task-" + taskId;
  newTask.innerText = taskName;

  const modifyTaskIcon = document.createElement("img")
  modifyTaskIcon.src = "../../build/img/icons/modify.svg"
  modifyTaskIcon.classList.add("w-6", "h-6")

  const modifyTaskBtn = document.createElement("button");
  modifyTaskBtn.className = // p-[0.1px]
    "inline-block ml-auto place-items-center rounded-md border border-transparent text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
  modifyTaskBtn.appendChild(modifyTaskIcon);
  modifyTaskBtn.addEventListener("click", async () => {
    document.getElementById("description-modal")?.classList.add("hidden");
    const task = await window.ipc.getTask(taskId)

    const task_id_modify_task = document.getElementById("task-id-modify-task") as HTMLInputElement
    task_id_modify_task.value = taskId;

    const name_modify_task = document.getElementById("name-modify-task") as HTMLInputElement
    name_modify_task.value = task[0].name;

    const date_modify_task = document.getElementById("date-modify-task") as HTMLInputElement
    date_modify_task.value = task[0].date;

    const description_modify_task = document.getElementById("description-modify-task") as HTMLInputElement
    description_modify_task.value = task[0].description;

    const list_id_modify_task = document.getElementById("list-id-modify-task") as HTMLInputElement
    list_id_modify_task.value = listElement.id.split("-")[1];

    const modifyTaskModal = document.getElementById("modify-task-modal");
    document.getElementById("blur")?.classList.remove("hidden");
    document.getElementById("name-modify-task")?.focus();
    modifyTaskModal?.classList.remove("hidden");
  });

  const deleteTaskIcon = document.createElement("img")
  deleteTaskIcon.src = "../../build/img/icons/delete.svg"
  deleteTaskIcon.classList.add("w-6", "h-6")

  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.className =
    "ml-auto grid place-items-center justify-self-end rounded-md border border-transparent p-[0.1px] text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
  deleteTaskBtn.appendChild(deleteTaskIcon);
  deleteTaskBtn.addEventListener("click", async () => {
    if (
      confirm(
        await getTranslationWithVar("Are_Sure", { title: taskName.toUpperCase(), type: await getTranslation("task") }),
      ) == true
    ) {
      await window.ipc.deleteTask(taskId)
      newTask.remove();
    }
  });

  newTask.appendChild(modifyTaskBtn);
  newTask.appendChild(deleteTaskBtn);

  newTask.addEventListener("click", async function (_event) {
    setTimeout(async () => {
        if (
          document.getElementById("modify-task-modal")?.classList.contains("hidden")
        ) {
          const descriptionModal = document.getElementById("description-modal");
          const descriptionTextModalElement = document.getElementById("description-text-modal") as HTMLInputElement;
          const descriptionTitleModalElement = document.getElementById("description-title-modal") as HTMLInputElement;
          const task = await window.ipc.getTask(taskId)

          descriptionTextModalElement.innerText = task[0].description;
          descriptionTitleModalElement.innerText = task[0].name;
          document.getElementById("blur")?.classList.remove("hidden");
          descriptionModal?.classList.remove("hidden");
        }
    }, 100);
  });

  taskContainer.appendChild(newTask);
}

export async function go_config_window() {
  await window.ipc.configWindow()
}
