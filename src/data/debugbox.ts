// ================================================================
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Source: https://github.com/ibtisam-iq/debugbox/blob/main/README.md
// Regenerate with: npm run generate
// ================================================================

export interface DebugBoxCommand {
  label: string
  command: string
}

export interface DebugBoxVariant {
  id: string
  label: string
  /** Compressed image size in MB, as published in the README size table. */
  sizeMB: number
  tagline: string
  /** True for the image published without a tag suffix. */
  isDefault: boolean
  commands: DebugBoxCommand[]
}

export const variants: DebugBoxVariant[] = [
  {
    "id": "lite",
    "label": "Lite",
    "sizeMB": 15,
    "tagline": "DNS and connectivity",
    "isDefault": false,
    "commands": [
      {
        "label": "kubectl debug",
        "command": "kubectl debug my-pod -it --image=ghcr.io/ibtisam-iq/debugbox:lite"
      },
      {
        "label": "docker run",
        "command": "docker run -it ghcr.io/ibtisam-iq/debugbox:lite"
      }
    ]
  },
  {
    "id": "balanced",
    "label": "Balanced",
    "sizeMB": 47,
    "tagline": "Daily Kubernetes debugging",
    "isDefault": true,
    "commands": [
      {
        "label": "kubectl debug",
        "command": "kubectl debug my-pod -it --image=ghcr.io/ibtisam-iq/debugbox"
      },
      {
        "label": "docker run",
        "command": "docker run -it ghcr.io/ibtisam-iq/debugbox"
      }
    ]
  },
  {
    "id": "power",
    "label": "Power",
    "sizeMB": 91,
    "tagline": "Packet analysis and forensics",
    "isDefault": false,
    "commands": [
      {
        "label": "kubectl debug",
        "command": "kubectl debug my-pod -it --image=ghcr.io/ibtisam-iq/debugbox:power"
      },
      {
        "label": "docker run",
        "command": "docker run -it ghcr.io/ibtisam-iq/debugbox:power"
      }
    ]
  }
]

/** The image DebugBox is measured against, from the same README table. */
export const comparison = {
  "label": "netshoot v0.15",
  "sizeMB": 202
}

/** Smallest variant against the comparison image, rounded. Derived, never typed. */
export const REDUCTION_PCT = 93

/** Works on clusters older than 1.23, where `kubectl debug` is unavailable. */
export const standaloneCommand = "kubectl run debug --rm -it --image=ghcr.io/ibtisam-iq/debugbox --restart=Never"

export const REPO_URL = "https://github.com/ibtisam-iq/debugbox"
export const DOCS_URL = "https://debugbox.ibtisam-iq.com"
export const TUTORIAL_URL = "https://labs.iximiuz.com/tutorials/kubernetes-debugging-with-debugbox-74e481c8"
