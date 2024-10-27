const tabGroup = document.querySelector("tab-group");
  tabGroup.setDefaultTab({
    title: "New Page",
    src: "index.html",
    active: true
  });
  const tab = tabGroup.addTab({
    title: "Test",
    src: "index.html"
  });
  const pos = tab.getPosition();
  console.log("Tab position is " + pos);