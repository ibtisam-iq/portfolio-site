export type CertificateCategory =
  | "kubernetes"
  | "cloud"
  | "iac"
  | "devops"
  | "security"
  | "other";

export interface CertDomain {
  name: string;
  weight: number;
}

export type Certificate = {
  id: string;
  title: string;
  shortTitle: string;
  issuer: string;
  date: string;
  category: CertificateCategory;
  notes: string;
  credlyLink: string;
  vaultNotesLink: string;
  validUntil: string;
  domains: CertDomain[];
};

export const certificates: Certificate[] = [
  {
    id: "LF-gjlveemoqf",
    title: "Certified Kubernetes Administrator (CKA)",
    shortTitle: "CKA",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    date: "Nov 2025",
    category: "kubernetes",
    notes: "Performance-based exam. 2 hours, 15-20 tasks in a live Kubernetes cluster. No multiple choice.",
    credlyLink: "https://www.credly.com/badges/0f1fd462-102e-42e8-932c-ebd4222d5587",
    vaultNotesLink: "https://cert-vault.ibtisam-iq.com/",
    validUntil: "Nov 2027",
    domains: [
      { name: "Troubleshooting", weight: 30 },
      { name: "Cluster Architecture, Installation & Configuration", weight: 25 },
      { name: "Services & Networking", weight: 20 },
      { name: "Workloads & Scheduling", weight: 15 },
      { name: "Storage", weight: 10 },
    ],
  },
  {
    id: "LF-l6qqde7lal",
    title: "Certified Kubernetes Application Developer (CKAD)",
    shortTitle: "CKAD",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    date: "Nov 2025",
    category: "kubernetes",
    notes: "Performance-based exam. 2 hours, 15-20 tasks focused on application lifecycle inside Kubernetes. No multiple choice.",
    credlyLink: "https://www.credly.com/badges/13e7993c-8bc1-4f82-822d-7382322f7b88",
    vaultNotesLink: "https://cert-vault.ibtisam-iq.com/",
    validUntil: "Nov 2027",
    domains: [
      { name: "Application Environment, Configuration & Security", weight: 25 },
      { name: "Application Design & Build", weight: 20 },
      { name: "Application Deployment", weight: 20 },
      { name: "Services & Networking", weight: 20 },
      { name: "Application Observability & Maintenance", weight: 15 },
    ],
  },
];
