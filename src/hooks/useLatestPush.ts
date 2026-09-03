// The most recently pushed public repository on the account, read from GitHub in the
// browser. It feeds the "shipped" line in the hero and the footer.
//
// Every other figure is fixed at build time and labelled with that date; this one states
// an age, which a stale build gets wrong. GitHub allows the direct read that Docker Hub
// and the contribution fragment refuse, so a rejected read keeps the build-time value.

import { useEffect, useState } from "react";
import { stats } from "../data/stats";

// The same account as scripts/generate-stats.js, spelled out in both because it is one
// fact that does not differ between the build and the browser.
const GITHUB_USER = "ibtisam-iq";
const ENDPOINT =
  `https://api.github.com/users/${GITHUB_USER}/repos` +
  `?sort=pushed&direction=desc&per_page=100&type=owner`;

// The same test as eligibleForShipping in scripts/generate-stats.js: a fork's pushed_at
// moves without a commit, and an archived repository is not being shipped.
interface Repo {
  name: string;
  pushed_at: string;
  html_url: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
}

const eligible = (r: Repo) => !r.fork && !r.archived && !r.private;

export interface LatestPush {
  repo: string;
  pushedAt: string;
  url: string;
}

// One request per page, shared by both callers and held for the session: the answer does
// not change while the page is open, and a rejected read resolves to null so the build-time
// value stands and the two lines still agree.
let pending: Promise<LatestPush | null> | undefined;

function latestPush(): Promise<LatestPush | null> {
  if (!pending) {
    pending = fetch(ENDPOINT, { headers: { Accept: "application/vnd.github+json" } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((repos: Repo[]) => {
        // Already sorted newest push first, so the first eligible entry is the answer, the
        // same one the build script reaches by sorting the list itself.
        const r = repos.filter(eligible)[0];
        return r ? { repo: r.name, pushedAt: r.pushed_at, url: `${r.html_url}/commits` } : null;
      })
      .catch(() => null);
  }
  return pending;
}

export function useLatestPush(): LatestPush {
  // Starts from the build-time value, so the line paints at once and never jumps; the live
  // reading replaces it when it resolves.
  const [push, setPush] = useState<LatestPush>(stats.lastShipped);

  useEffect(() => {
    let active = true;
    latestPush().then((result) => {
      if (active && result) setPush(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return push;
}
