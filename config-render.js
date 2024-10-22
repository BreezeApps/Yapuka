const { ipcRenderer } = require("electron");
// require("./theme.js");
const { getLanguages, changesLanguage } = require("./i18n.js")

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
    "mysql_db"
  );
  if(mysql.value === "false") {
    mysql.value = false
  } else {
    mysql.value = true
  }
  document.getElementById("db_enable").checked = mysql.value;
  enable_text(mysql);

  const host = await ipcRenderer.invoke("get-config-variable", "db_host");
  document.getElementById("db_host").value = host.value;

  const port = await ipcRenderer.invoke("get-config-variable", "db_port");
  document.getElementById("db_port").value = port.value;

  const user = await ipcRenderer.invoke("get-config-variable", "db_user");
  document.getElementById("db_user").value = user.value;

  const password = await ipcRenderer.invoke(
    "get-config-variable",
    "db_password"
  );
  document.getElementById("db_password").value = password.value;

  var options = "<option value='system' id='options-system-lang'>System</option>"
  const languages = getLanguages()
  languages.forEach(element => {
    options += "<option value='" + element.short + "' id='options-" + element.short + "' >";
    options += element.full;
    options += "</option>";
  });
  document.getElementById("language").innerHTML = options

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
    if(window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
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
