"use client";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const toggleTheme = () => {
    const currentTheme = document.documentElement.dataset.theme as Theme | undefined;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("docs-theme", nextTheme);
  };

  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <svg className="theme-toggle__moon" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20.2 15.5A8.5 8.5 0 0 1 8.5 3.8 8.5 8.5 0 1 0 20.2 15.5Z" />
      </svg>
      <svg className="theme-toggle__sun" aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
    </button>
  );
}
