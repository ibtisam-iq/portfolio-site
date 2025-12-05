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
  date: string; // e.g. "2024"
  category: CertificateCategory;
  badge: string; // emoji/icon
  notes: string; // short description (you can refine later)
  verificationText: string;
  verificationLink: string;
  credlyLink: string;
  prepNotesLink: string;
  isTop: boolean; // 👈 used for "Top Certifications"
};

// ⚠️ Fill / adjust these as you like.
// I’m only setting minimal placeholders where needed.
// You’ll replace issuer, links, notes, etc. with your real data.

export const certificates: Certificate[] = [
  {
    id: "cka",
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    date: "2024",
    category: "kubernetes",
    badge: "🏅",
    notes: "Hands-on Kubernetes cluster administration, troubleshooting, and production-style scenarios.",
    verificationText: "Verify on CNCF Registry",
    verificationLink: "https://www.cncf.io/certification/verify/",
    credlyLink: "https://www.credly.com/",
    prepNotesLink: "https://github.com/yourusername/cka-prep",
    isTop: true,
  },
  {
    id: "ckad",
    title: "Certified Kubernetes Application Developer (CKAD)",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    date: "2024",
    category: "kubernetes",
    badge: "🏅",
    notes: "Real-world Kubernetes application design, troubleshooting, and hands-on workload scenarios.",
    verificationText: "Verify on CNCF Registry",
    verificationLink: "https://www.cncf.io/certification/verify/",
    credlyLink: "https://www.credly.com/",
    prepNotesLink: "https://github.com/yourusername/ckad-prep",
    isTop: true,
  },

  // ⬇️ Example placeholders – you can uncomment + adjust when ready

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
