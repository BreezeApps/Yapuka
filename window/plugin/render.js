const { ipcRenderer } = require("electron");

async function loadPlugins() {
  const plugins = await ipcRenderer.invoke("get-plugins-list");
  const pluginList = document.getElementById("pluginList");

  plugins.forEach((plugin) => {
    console.log(plugin.github_url)
    const listItem = document.createElement("li");
    listItem.textContent = `${plugin.name}: ${plugin.description}`;

    const installButton = document.createElement("button");
    installButton.textContent = "Install";
    installButton.onclick = () =>
      ipcRenderer.invoke("install-plugin", plugin.github_url);

    listItem.appendChild(installButton);
    pluginList.appendChild(listItem);
  });
}

loadPlugins();
