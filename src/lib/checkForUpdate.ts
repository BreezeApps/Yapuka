import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";

/**
 * The function `checkForAppUpdates` checks for available updates for an application and prompts the
 * user to update if one is available.
 * @param {boolean} onUserClick - The `onUserClick` parameter in the `checkForAppUpdates` function is a
 * boolean value that indicates whether the user has clicked on something in the application. It is
 * used to determine the flow of the update process based on user interaction.
 */
export async function checkForAppUpdates(onUserClick: boolean) {
  const update = await check();
  if (!update?.available) {
    console.log("No update available");
  } else if (update?.available) {
    console.log("Update available!", update.version, update.body);
    const yes = await ask(
      `Update to ${update.version} is available!\n\nRelease notes: ${update.body}`,
      {
        title: "Update Available",
        kind: "info",
        okLabel: "Update",
        cancelLabel: "Cancel",
      },
    );
    if (yes) {
      await update.downloadAndInstall();
      await relaunch();
    }
  } else if (onUserClick) {
    await message("You are on the latest version. Stay awesome!", {
      title: "No Update Available",
      kind: "info",
      okLabel: "OK",
    });
  }
}
