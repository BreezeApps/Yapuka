const { ipcRenderer } = require("electron");
// require("./theme.js");
const { getLanguages, changesLanguage } = require("./i18n.js")

document.getElementById('DB_file').addEventListener('click', (e) => {
  e.preventDefault
  window.postMessage({
    type: 'select-dirs'
  })
})

// function test() {
//   console.log(document.getElementById("myFile").files[0].path)
// }

async function load() {
  var options = "<option value='system' id='options-system-lang' data-i18n='system_theme'></option>"
  const languages = getLanguages()
  languages.forEach(element => {
    options += "<option value='" + element.short + "' id='options-" + element.short + "' >";
    options += element.full;
    options += "</option>";
  });
  document.getElementById("language").innerHTML = options

  const blur = await ipcRenderer.invoke("get-blur");
  if(blur[0].value === "1") {
    document.getElementById("blur").checked = true
  } else {
    document.getElementById("blur").checked = false
  }

  themeSetup();
}

async function themeChange(value) {
  if (value === "dark") {
    localStorage.setItem("theme", "dark")
    const theme = await ipcRenderer.invoke("update-theme", "dark")
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else if (value === "light") {
    localStorage.setItem("theme", "light")
    const theme = await ipcRenderer.invoke("update-theme", "light")
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else {
    localStorage.setItem("theme", "system")
    const theme = await ipcRenderer.invoke("update-theme", "system")
    if(window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }
}

async function blurChange(value) {
  const blur = await ipcRenderer.invoke("update-blur", value);
}
// if (theme === "dark") {
//   document.documentElement.classList.add("dark");
//   document.documentElement.classList.remove("light");
// } else if (theme === "light") {
//   document.documentElement.classList.add("light");
//   document.documentElement.classList.remove("dark");
// } else {
//   if(window.matchMedia('(prefers-color-scheme: light)').matches) {
//     document.documentElement.classList.add("light");
//     document.documentElement.classList.remove("dark");
//   } else {
//     document.documentElement.classList.add("dark");
//     document.documentElement.classList.remove("light");
//   }
// }

function themeSetup() {
  if (localStorage.theme === "dark") {
    document.getElementById("options-dark").selected = true;
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else if (localStorage.theme === "light") {
    document.getElementById("options-light").selected = true;
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else {
    document.getElementById("options-system").selected = true;
    if(window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }
}

// async function configh1() {
//     const host = await ipcRenderer.invoke('get-config-variable', 'database.host');

//     const test = document.getElementById('test')
//     test.innerHTML = host
//   }

// configh1()
