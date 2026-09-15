// Applies the stored theme before first paint, so a light-mode visitor never sees a dark
// flash. React reads the same key in src/context/ThemeContext.tsx and owns it from mount.
// Self-hosted rather than inline: an inline script would need its own hash in the container's
// content security policy, and a hash breaks silently on any whitespace edit.
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
