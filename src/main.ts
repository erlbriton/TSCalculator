import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

document.getElementById("win-minimize")?.addEventListener("click", () => {
  appWindow.minimize();
});

document.getElementById("win-close")?.addEventListener("click", () => {
  appWindow.close();
});

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

const THEME_STORAGE_KEY = "calculator-theme";
type ThemeMode = "light" | "dark";

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

//------------Переключение тем--------------------------------------------------------------------

// Определяет стартовую тему при запуске приложения и возвращает значение типа ThemeMode
function getInitialTheme(): ThemeMode {
  // Пытаемся прочитать сохранённую тему из localStorage по ключу THEME_STORAGE_KEY (вернёт string или null)
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  // Проверяем, что в сохранённом значении лежит именно валидная тема ("light" или "dark"), а не мусор или null
  if (saved === "light" || saved === "dark") {
    // Если тема валидна — сразу используем её
    return saved;
  }
  // Если сохранённой темы нет — проверяем системную настройку ОС (тёмная тема включена или нет)
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // Возвращаем "dark", если система в тёмной теме, иначе — "light" по умолчанию
  return prefersDark ? "dark" : "light";
}

// Применяет выбранную тему к документу и сохраняет её в localStorage; ничего не возвращает (void)
function applyTheme(theme: ThemeMode): void {
  // Записываем атрибут data-theme="..." на корневой элемент <html>, чтобы работали CSS-селекторы [data-theme="..."]
  document.documentElement.dataset.theme = theme;
  // Сохраняем выбранную тему в localStorage, чтобы она не сбрасывалась после перезапуска приложения
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

// Ждём, когда DOM-дерево HTML будет полностью построено, и только потом ищем элементы и вешаем обработчики
document.addEventListener("DOMContentLoaded", () => {
  // Получаем стартовую тему (из localStorage или из настроек системы)
  const initialTheme = getInitialTheme();
  // Сразу применяем её при загрузке, чтобы интерфейс не мигнул темой по умолчанию
  applyTheme(initialTheme);

  // Ищем в DOM кнопку переключения стиля по её id="btn-style"
  const styleBtn = document.getElementById("btn-style");
  // Подписываемся на клик; ?. (optional chaining) защищает от ошибки, если кнопка вдруг не найдена (null)
  styleBtn?.addEventListener("click", () => {
    // Читаем текущий data-theme с <html>: если там "dark" — берём "dark", иначе считаем, что сейчас "light"
    const current: ThemeMode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    // Вычисляем следующую тему по кругу: с "dark" на "light", с "light" на "dark"
    const next: ThemeMode = current === "dark" ? "light" : "dark";
    // Применяем новую тему и записываем её в localStorage
    applyTheme(next);
  });
});