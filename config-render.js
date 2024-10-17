const { ipcRenderer } = require("electron");
require("./theme.js");

function enable_text(status) {
  status = status ? false : true;
  document.getElementById("db_host").disabled = status;
  document.getElementById("db_port").disabled = status;
  document.getElementById("db_user").disabled = status;
  document.getElementById("db_password").disabled = status;
}

async function load() {
  const mysql = await ipcRenderer.invoke(
    "get-config-variable",
    "mysql_database",
  );
  document.getElementById("db_enable").checked = mysql;
  enable_text(mysql);

  const host = await ipcRenderer.invoke("get-config-variable", "database.host");
  document.getElementById("db_host").value = host;

  const port = await ipcRenderer.invoke("get-config-variable", "database.port");
  document.getElementById("db_port").value = port;

  const user = await ipcRenderer.invoke("get-config-variable", "database.user");
  document.getElementById("db_user").value = user;

  const password = await ipcRenderer.invoke(
    "get-config-variable",
    "database.password",
  );
  document.getElementById("db_password").value = password;

  themeSetup();
}

function themeChange(value) {
  if (value === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else if (value === "light") {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
  }
}
function themeSetup() {
  if (localStorage.theme === "dark") {
    document.getElementById("options-dark").selected = true;
  } else if (localStorage.theme === "light") {
    document.getElementById("options-light").selected = true;
  } else {
    document.getElementById("options-system").selected = true;
  }
}

// async function configh1() {
//     const host = await ipcRenderer.invoke('get-config-variable', 'database.host');

//     const test = document.getElementById('test')
//     test.innerHTML = host
//   }

// configh1()
