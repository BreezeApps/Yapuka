const fs = require("fs");
const path = require("path");

const version = process.env.GITHUB_REF_NAME || "v0.0.0"; // Récupère le tag (ex: "v1.0.0")
const baseUrl = "https://github.com/breezeapps/Yapuka/releases/download"; // Remplace par ton repo

const platforms = {
  "windows": `/${version}/app_installer.exe`,
  "macos": `/${version}/app.dmg`,
  "linux": `/${version}/app.AppImage`
};

// Génération du JSON
const updaterData = {
  version: version.replace("v", ""), // Enlève le "v" du tag
  notes: "Voir les nouveautés sur la page de release.",
  pub_date: new Date().toISOString(),
  platforms: {
    "windows": {
      url: `${baseUrl}${platforms.windows}`,
      signature: "SHA256_HASH_WINDOWS"
    },
    "macos": {
      url: `${baseUrl}${platforms.macos}`,
      signature: "SHA256_HASH_MACOS"
    },
    "linux": {
      url: `${baseUrl}${platforms.linux}`,
      signature: "SHA256_HASH_LINUX"
    }
  }
};

// Écriture dans le fichier updater.json
const filePath = path.join(__dirname, "../latest.json");
fs.writeFileSync(filePath, JSON.stringify(updaterData, null, 2));

console.log("✅ latest.json mis à jour :", updaterData);
