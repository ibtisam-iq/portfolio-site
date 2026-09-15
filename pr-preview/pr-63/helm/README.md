# ibtisam-iq Helm Chart

[![Helm: Package & Push](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/helm-release.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/helm-release.yml)

Helm chart for deploying **[ibtisam-iq.com](https://ibtisam-iq.com)** on Kubernetes.

---

## Quick Start

```bash
# Deploy from GHCR OCI registry
helm upgrade --install portfolio-site oci://ghcr.io/ibtisam-iq/ibtisam-iq \
  --version 0.1.0

# Deploy from local source
helm upgrade --install portfolio-site ./helm

# Uninstall
helm uninstall portfolio-site
```

---

## Architecture & Security

* **Rootless Execution**: Runs as non-root (`USER nginx`, UID `1001`) with a read-only root filesystem and all Linux capabilities dropped.
* **Modern Networking**: Pre-configured templates for standard Kubernetes Ingress as well as Kubernetes Gateway API (`HTTPRoute`).
* **CI/CD Integration**: Fully automated OCI packaging and registry publishing via [.github/workflows/helm-release.yml](../.github/workflows/helm-release.yml).

---

## Key Parameters

See [the chart defaults](values.yaml) for the full list.

| Parameter | Default | Description |
| --- | --- | --- |
| `replicaCount` | `1` | Pod replica count |
| `image.repository` | `ghcr.io/ibtisam-iq/ibtisam-iq` | OCI image registry |
| `image.tag` | `"latest"` | Image tag (defaults to `appVersion` if empty) |
| `service.port` | `8080` | Service port targeting rootless container port |
| `ingress.enabled` | `false` | Enable traditional Ingress resource |
| `httpRoute.enabled` | `false` | Enable Gateway API `HTTPRoute` resource |
| `autoscaling.enabled` | `false` | Enable Horizontal Pod Autoscaler (HPA) |
| `resources` | `{}` | CPU/Memory requests and limits |
