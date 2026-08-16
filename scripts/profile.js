// Identity, credentials, sites and profiles. scripts/prerender-meta.js derives the JSON-LD
// graph, robots.txt, sitemap.xml, llms.txt and profile.json from this file during
// `npm run build`. None of those are committed, so this is the only place they are edited.
//
// Page routes are the exception: they live in prerender-meta.js, because they have to
// track src/App.tsx rather than anything here.
//
// profile.json is published at https://ibtisam-iq.com/profile.json so that anything
// needing these facts fetches them over HTTP instead of vendoring a copy.

export const profile = {
  name: 'Muhammad Ibtisam Iqbal',
  alternateName: 'Muhammad Ibtisam',
  jobTitle: 'DevOps & Cloud Engineer',
  email: 'contact@ibtisam-iq.com',
  site: 'https://ibtisam-iq.com',

  location: { city: 'Islamabad', country: 'PK' },
  alumniOf: 'University of Agriculture, Faisalabad',

  // No counts here. Project totals, tool totals and image sizes are rendered by the
  // sites that own the underlying data, and a figure repeated in this file would have
  // to be updated in step with them.
  summary:
    'CKA and CKAD certified DevOps & Cloud Engineer in Islamabad, Pakistan, building ' +
    'Kubernetes clusters, CI/CD pipelines and AWS infrastructure from first principles. ' +
    'Audits and modernises application codebases across Java, Python and Node.js ' +
    '(dependency upgrades, config externalization, health endpoints, architectural ' +
    'refactoring) before containerising and deploying them. Core stack: Kubernetes on ' +
    'kubeadm and EKS, Docker, Helm, Helmfile, Kustomize and ArgoCD, provisioned with ' +
    'Terraform and Ansible on Linux, delivered through Jenkins and GitHub Actions. ' +
    'DevSecOps scanning (Trivy, Gitleaks, SonarQube, cosign) and observability ' +
    '(Prometheus, Grafana, the Elastic Stack) are wired into the same pipelines rather ' +
    'than bolted on afterwards. Every project ships with source code, runbooks and ' +
    'architecture documentation.',

  // Awarded credentials only. Anything in progress belongs on the certifications page,
  // where it can be labelled as such; hasCredential has no way to express it.
  credentials: [
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      id: 'LF-gjlveemoqf',
      issuer: 'Cloud Native Computing Foundation',
      url: 'https://www.credly.com/badges/0f1fd462-102e-42e8-932c-ebd4222d5587',
    },
    {
      name: 'Certified Kubernetes Application Developer (CKAD)',
      id: 'LF-l6qqde7lal',
      issuer: 'Cloud Native Computing Foundation',
      url: 'https://www.credly.com/badges/13e7993c-8bc1-4f82-822d-7382322f7b88',
    },
  ],

  // `sitemap` is the URL confirmed to return XML, or null. Nothing is fetched at build
  // time, so the field records a manual check. A path that 404s or falls through to an SPA
  // shell is reported as a fetch error in Search Console until fixed, so null is the default.
  sites: [
    {
      label: 'Portfolio',
      url: 'https://ibtisam-iq.com',
      sitemap: 'https://ibtisam-iq.com/sitemap.xml',
      note: 'background, the tool-by-tool engineering stack, certifications with verification links, and CV',
      group: 'start',
    },
    {
      label: 'Projects',
      url: 'https://projects.ibtisam-iq.com',
      sitemap: 'https://projects.ibtisam-iq.com/sitemap.xml',
      note: 'EKS deployments, GitOps with ArgoCD, Terraform provisioning and DevSecOps pipelines, each with source code and runbooks',
      group: 'start',
    },
    {
      label: 'Blog',
      url: 'https://blog.ibtisam-iq.com',
      sitemap: 'https://blog.ibtisam-iq.com/sitemap.xml',
      note: 'failure-first write-ups on what broke, why, and what the failure turned out to be about',
      group: 'writing',
    },
    {
      label: 'Runbook',
      url: 'https://runbook.ibtisam-iq.com',
      sitemap: 'https://runbook.ibtisam-iq.com/sitemap.xml',
      note: 'decisions and debugging recorded while the work was fresh',
      group: 'writing',
    },
    {
      label: 'Nectar',
      url: 'https://nectar.ibtisam-iq.com',
      sitemap: 'https://nectar.ibtisam-iq.com/sitemap.xml',
      note: 'engineering knowledge base covering Kubernetes, AWS, Linux, networking, containers and CI/CD',
      group: 'writing',
    },
    {
      label: 'Cert Vault',
      url: 'https://cert-vault.ibtisam-iq.com',
      sitemap: 'https://cert-vault.ibtisam-iq.com/sitemap.xml',
      note: 'CKA and CKAD preparation notes',
      group: 'writing',
    },
    {
      label: 'DebugBox',
      url: 'https://debugbox.ibtisam-iq.com',
      // mike versions the docs, so there is no sitemap at the root.
      sitemap: 'https://debugbox.ibtisam-iq.com/latest/sitemap.xml',
      note: 'Kubernetes debugging containers in size-scoped Alpine variants',
      group: 'oss',
    },
    {
      label: 'SilverStack',
      url: 'https://github.com/ibtisam-iq/silver-stack',
      sitemap: null,
      note: 'custom OCI rootfs images that boot as Firecracker microVMs, published as browser-launchable playgrounds',
      group: 'oss',
    },
  ],

  // `verifiable: true` where the platform produces the record, not me: commit history,
  // a badge issued by CNCF, published image digests and pull counts. The rest are real
  // profiles, but their contents are self-authored, so llms.txt lists them separately
  // and does not present them as corroboration.
  profiles: [
    { label: 'GitHub', url: 'https://github.com/ibtisam-iq', verifiable: true },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ibtisam-iq' },
    { label: 'Credly', url: 'https://www.credly.com/users/ibtisam-iq/', verifiable: true },
    { label: 'Docker Hub', url: 'https://hub.docker.com/u/mibtisam', verifiable: true },
    { label: 'iximiuz Labs', url: 'https://labs.iximiuz.com/a/ibtisam-iq', verifiable: true },
    { label: 'Stack Overflow', url: 'https://stackoverflow.com/users/33012784/ibtisam-iq' },
    { label: 'Dev.to', url: 'https://dev.to/ibtisam-iq' },
    { label: 'Medium', url: 'https://ibtisam-iq.medium.com/' },
    { label: 'Hashnode', url: 'https://hashnode.com/@ibtisam-iq' },
    { label: 'Hacker News', url: 'https://news.ycombinator.com/user?id=ibtisam-iq' },
    { label: 'Reddit', url: 'https://www.reddit.com/user/ibtisam-iq/' },
    { label: 'X', url: 'https://x.com/ibtisam_iq' },
    { label: 'Peerlist', url: 'https://peerlist.io/ibtisam_iq' },
    { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Muhammad-Ibtisam-Iqbal' },
    { label: 'Bayt', url: 'https://people.bayt.com/ibtisam-iq/' },
    { label: 'Raindrop', url: 'https://raindrop.io/ibtisam-iq' },
    { label: 'Cal.com', url: 'https://cal.com/ibtisam-iq' },
  ],

  // Topics, not an inventory: src/data/skills.ts holds the full tool list and the
  // /skills page renders it. This is the subset worth asserting as subject matter,
  // grouped from discipline down to specific technology. Adding a tool to skills.ts
  // does not require a line here unless it changes what the work is about.
  knowsAbout: [
    'DevOps',
    'DevSecOps',
    'Platform Engineering',
    'GitOps',
    'Infrastructure as Code',
    'CI/CD',
    'Observability',
    'Software Supply Chain Security',

    'Kubernetes',
    'kubeadm',
    'Amazon EKS',
    'Docker',
    'Helm',
    'Helmfile',
    'Kustomize',
    'ArgoCD',
    'Kubernetes Gateway API',

    'Amazon Web Services',
    'Terraform',
    'Ansible',

    'Jenkins',
    'GitHub Actions',
    'SonarQube',
    'Trivy',

    'Linux system administration',
    'systemd',
    'Alpine Linux',
    'Nginx',
    'Bash scripting',
    'Firecracker microVMs',

    'Prometheus',
    'Grafana',
    'Elastic Stack',

    'Technical documentation',
  ],
}
