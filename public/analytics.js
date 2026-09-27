// Configures Google Analytics, and asks for the tag itself once the page has loaded.
// Self-hosted rather than inline for the same reason as public/theme.js: this keeps the
// container's content security policy at `script-src 'self' <the tag's host>` with no hash
// to maintain, and a hash breaks silently on any edit.
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-XP2J3MPRYJ");

// The tag is 170 KB of script that measures the page rather than building it, so it waits
// until the page has finished loading. The calls above are queued on dataLayer and the tag
// replays them when it arrives, so nothing is lost by asking late.

// The cost of waiting: a visitor who leaves within the first second or so is not counted.
function loadTag() {
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-XP2J3MPRYJ";
  document.head.appendChild(s);
}

if (document.readyState === "complete") loadTag();
else window.addEventListener("load", loadTag, { once: true });
