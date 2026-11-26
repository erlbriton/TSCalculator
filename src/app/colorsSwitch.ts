const THEMES = ["light", "dark", "green", "blue", "red"] as const; // Массив тем
type ThemeMode = (typeof THEMES)[number]; // Новый тип данных "THEMES[]"
const THEME_STORAGE_KEY = "calculator-theme";

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

// Определяет стартовую тему при запуске приложения и возвращает значение типа ThemeMode
function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(THEME_STORAGE_KEY); // Пытаемся прочитать сохранённую тему из localStorage по ключу THEME_STORAGE_KEY (вернёт string или null)

  // Проверяем, что в сохранённом значении лежит именно валидная тема ("light", "dark"...), а не мусор или null
  if (isThemeMode(saved)) {
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

function setupThemeToggle(): void {
  // Ищем в DOM кнопку переключения стиля по её id="btn-style"
  const styleBtn = document.getElementById("btn-style");

  // Подписываемся на клик; ?. (optional chaining) защищает от ошибки, если кнопка вдруг не найдена (null)
  styleBtn?.addEventListener("click", () => {
    const rawTheme = document.documentElement.dataset.theme;
    const current: ThemeMode = isThemeMode(rawTheme) ? rawTheme : THEMES[0];

    const currentIndex = THEMES.indexOf(current);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const next: ThemeMode = THEMES[(safeIndex + 1) % THEMES.length];

    applyTheme(next);
  });
}

function runThemeInitialization(): void {
  // Получаем стартовую тему (из localStorage или из настроек системы)
  const initialTheme = getInitialTheme();
  // Сразу применяем её при загрузке, чтобы интерфейс не мигнул темой по умолчанию
  applyTheme(initialTheme);
  // Навешиваем обработчик переключения темы по кругу
  setupThemeToggle();
}

// Единственная точка входа модуля для подключения из main.ts
export function initTheme(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runThemeInitialization, { once: true });
  } else {
    runThemeInitialization();
  }
}