
This error is **not** a CI bug and **not** a YAML mistake.

It is a **GitHub Pages configuration gap** — and your pipeline is behaving correctly by failing.

I’ll explain it cleanly and precisely, then give you the exact fix.

---

## What the error actually means

Key lines:

> `Creating Pages deployment failed`
> `HttpError: Not Found`
> `Ensure GitHub Pages has been enabled`

This tells us **three important facts**:

1. ✅ The build artifact **exists**
2. ✅ GitHub Actions **can see it**
3. ❌ GitHub Pages is **NOT enabled for this repository**

So when `actions/deploy-pages@v4` tries to create a deployment, GitHub responds:

> “Pages is not enabled here — nothing to deploy to.”

That’s why the API returns **404** (endpoint does not exist *for this repo*).

---

## Why this happens (very important concept)

GitHub Pages has **two layers**:

### Layer 1 — CI pipeline (you already did this correctly)

* build site
* upload Pages artifact
* call deploy API

### Layer 2 — Repository Pages configuration (**missing**)

GitHub will **refuse deployments** unless Pages is explicitly enabled in repo settings.

This is intentional.
GitHub does **not** auto-enable Pages for security reasons.

---

## How to fix it (2 minutes, no code changes)

### Step 1 — Go to repository settings

Open this exact URL:

👉 **[https://github.com/ibtisam-iq/portfolio-site/settings/pages](https://github.com/ibtisam-iq/portfolio-site/settings/pages)**

---

### Step 2 — Enable GitHub Pages

In **Settings → Pages**:

* **Source**:
  Select
  👉 **GitHub Actions**

⚠️ Do **NOT** select:

* `Deploy from a branch`
* `gh-pages`

Your pipeline is **artifact-based**, so **GitHub Actions** is the only correct choice.

---

### Step 3 — Save

That’s it.

No secrets.
No tokens.
No workflow edits.

---

## Why older workflows needed tokens (and yours doesn’t)

You asked earlier why this disappeared:

```yaml
github_token
publish_branch
force_orphan
```

Answer:

* Those were needed for **branch-based Pages**
* You are using **deploy-pages@v4**
* GitHub now handles auth internally via **OIDC**

Your workflow is **modern and correct**.

---