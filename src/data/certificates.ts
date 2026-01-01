// src/data/certificates.ts

export type CertificateCategory =
  | "kubernetes"
  | "cloud"
  | "iac"
  | "devops"
  | "security"
  | "other";

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string; // e.g. "2025"
  category: CertificateCategory;
  badge: string; // emoji/icon
  notes: string; // short description
  credlyLink: string;
  prepNotesLink: string;
  isTop: boolean; // 👈 used for "Top Certifications"
};

export const certificates: Certificate[] = [
  {
    id: "LF-gjlveemoqf",
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    date: "Nov 2025",
    category: "kubernetes",
    badge: "🏅",
    notes: "Hands-on Kubernetes cluster administration, troubleshooting, and production-style scenarios.",
    credlyLink: "https://www.credly.com/badges/0f1fd462-102e-42e8-932c-ebd4222d5587",
    prepNotesLink: "https://cert-prep.ibtisam-iq.com/",
    isTop: true,
  },
  {
    id: "LF-l6qqde7lal",
    title: "Certified Kubernetes Application Developer (CKAD)",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    date: "Nov 2025",
    category: "kubernetes",
    badge: "🏅",
    notes: "Real-world Kubernetes application design, troubleshooting, and hands-on workload scenarios.",
    credlyLink: "https://www.credly.com/badges/13e7993c-8bc1-4f82-822d-7382322f7b88",
    prepNotesLink: "https://cert-prep.ibtisam-iq.com/",
    isTop: true,
  },

  // Example placeholders – uncomment + adjust when ready

  // {
  //   id: "aws-saa",
  //   title: "AWS Certified Solutions Architect – Associate",
  //   issuer: "Amazon Web Services",
  //   date: "In Progress",
  //   category: "cloud",
  //   badge: "☁️",
  //   notes: "Designing highly available and scalable AWS architectures.",
  //   verificationText: "Verify on AWS Certification Portal",
  //   verificationLink: "https://www.aws.training/Certification",
  //   credlyLink: "",
  //   prepNotesLink: "",
  //   isTop: true,
  // },
  // {
  //   id: "terraform",
  //   title: "Terraform Infrastructure as Code – Practical Track",
  //   issuer: "Internal / Self-Study",
  //   date: "2024",
  //   category: "iac",
  //   badge: "🏗️",
  //   notes: "Hands-on Terraform projects for cloud-native infrastructure provisioning.",
  //   verificationText: "Project-based validation (see portfolio)",
  //   verificationLink: "https://ibtisam-iq.com/projects",
  //   credlyLink: "",
  //   prepNotesLink: "",
  //   isTop: false,
  // },
];
