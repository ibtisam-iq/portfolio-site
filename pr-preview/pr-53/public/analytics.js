// Configures Google Analytics. The loader itself is the async tag in index.html.
// Self-hosted rather than inline for the same reason as public/theme.js: this keeps the
// container's content security policy at `script-src 'self' <the tag's host>` with no hash
// to maintain, and a hash breaks silently on any edit.
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-XP2J3MPRYJ");
