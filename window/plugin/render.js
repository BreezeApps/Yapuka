const { ipcRenderer } = require("electron");
const i18next = require("../../utils/i18n.js")

window.onload = async () => {
  new i18next()
  i18next.init()
  setTimeout(function () {
    i18next.updateContent();
  }, 500);
}

async function loadPlugins() {
  const plugins = await ipcRenderer.invoke("get-plugins-list");
  const pluginList = document.getElementById("pluginList");

  if (!plugins.lenght() === 0) {
    plugins.forEach(plugin => {
      const listItem = document.createElement('li');
      listItem.classList = 'bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center';
  
      // Plugin info
      const pluginInfo = document.createElement('div');
      pluginInfo.innerHTML = `<p class="font-semibold text-gray-700">${plugin.name}</p><p class="text-sm text-gray-500">${plugin.description}</p>`;
  
      // Install button
      const installButton = document.createElement('button');
      installButton.setAttribute("data-i18n", "plugins-install")
      installButton.classList = 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition';
      installButton.onclick = () => installPlugin(plugin.github_url);
      
      listItem.appendChild(pluginInfo);
      listItem.appendChild(installButton);
      pluginList.appendChild(listItem);
    });
  } else {
    pluginList.appendChild(document.createElement("h1").innerText = "There are no plugins or we couldn't find it")
  }
}

async function installPlugin(githubUrl) {
  const result = await ipcRenderer.invoke('install-plugin', githubUrl);
  if (!result.toString().includes("https://github.com")) {
    alert(i18next.getTranslation("plugin-installed"));
  } else {
    if (window.confirm(i18next.getTranslation("plugins-failed"))) {
      require("electron").shell.openExternal(result)
    }
  }
}

loadPlugins();
