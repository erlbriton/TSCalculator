import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { initTheme } from "./app/colorsSwitch";
import { loadKey } from "./app/calculatorStd/setup";

initTheme();
loadKey();

const appWindow = getCurrentWindow();

document.getElementById("win-minimize")?.addEventListener("click", () => {
  appWindow.minimize();
});

document.getElementById("win-close")?.addEventListener("click", () => {
  appWindow.close();
});

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

//const THEME_STORAGE_KEY = "calculator-theme";
//type ThemeMode = "light" | "dark";

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
  document.querySelector("#greet-bye")?.addEventListener("click", (e) => {
    e.preventDefault();
    greet();
  });
});

(document.querySelector(".titlebar") as HTMLElement | null)?.addEventListener("mousedown", (e: MouseEvent) => {
  console.log("MOUSEDOWN_TITLEBAR", e.button, e.target);
  if (e.button !== 0) return;
  if ((e.target as HTMLElement | null)?.closest(".titlebar__controls")) return;
  console.log("CALLING_START_DRAGGING");
  appWindow.startDragging().catch((err) => console.error("START_DRAGGING_ERR:", err));
});
