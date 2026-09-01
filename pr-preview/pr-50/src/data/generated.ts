// ================================================================
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Source of truth:
//   https://github.com/ibtisam-iq/projects/blob/main/data/projects.yaml
// Written by scripts/generate-from-projects.js. Regenerate with: npm run generate
// ================================================================

export interface ProjectRef {
  name: string
  slug: string
}

/**
 * How the projects repository evidences a tool. "tech" is a match in a project's
 * `tech:` list; "tag" and "link" cover entries naming a practice rather than a binary.
 */
export type EvidenceKind = "tech" | "tag" | "link"

export interface FeaturedProject {
  title: string
  description: string
  tech: string[]
  url: string
}

export const PROJECTS_URL = "https://projects.ibtisam-iq.com"

/** Total projects upstream, not only the featured ones. */
export const PROJECT_COUNT = 8

/** Distinct entries across every project's `tech:` list. */
export const TECH_COUNT = 92

export interface ToolRef {
  name: string
}

export interface ToolCategory {
  id: string
  title: string
  tools: ToolRef[]
}

/**
 * The visible tools page, grouped by the projects repository's own six domains. Holds
 * only technologies flagged `showcase: true` in its TECH_REGISTRY that a project
 * actually uses, plus the trained tools. Within a group, most-used first.
 */
export const categories: ToolCategory[] = [
  {
    "id": "cloud-iac",
    "title": "Cloud & Infrastructure as Code",
    "tools": [
      {
        "name": "AWS EC2"
      },
      {
        "name": "Terraform"
      },
      {
        "name": "Amazon RDS"
      },
      {
        "name": "Amazon Route 53"
      },
      {
        "name": "Amazon S3"
      },
      {
        "name": "CloudFormation"
      },
      {
        "name": "Amazon CloudFront"
      },
      {
        "name": "eksctl"
      },
      {
        "name": "Ansible"
      }
    ]
  },
  {
    "id": "containers-orch",
    "title": "Containers & Orchestration",
    "tools": [
      {
        "name": "Docker"
      },
      {
        "name": "Kubernetes"
      },
      {
        "name": "Amazon EKS"
      },
      {
        "name": "Amazon EBS CSI Driver"
      },
      {
        "name": "AWS Load Balancer Controller"
      },
      {
        "name": "kubeadm"
      },
      {
        "name": "Kustomize"
      },
      {
        "name": "Amazon ECS"
      },
      {
        "name": "Gateway API"
      },
      {
        "name": "Helm"
      },
      {
        "name": "AWS Application Load Balancer"
      },
      {
        "name": "Docker (Buildx & QEMU)"
      },
      {
        "name": "Docker Compose"
      },
      {
        "name": "ExternalDNS"
      },
      {
        "name": "Helmfile"
      },
      {
        "name": "Metrics Server"
      },
      {
        "name": "NGINX Gateway Fabric"
      }
    ]
  },
  {
    "id": "cicd-gitops",
    "title": "CI/CD & GitOps",
    "tools": [
      {
        "name": "GHCR"
      },
      {
        "name": "GitHub Actions"
      },
      {
        "name": "Docker Hub"
      },
      {
        "name": "Jenkins"
      },
      {
        "name": "Maven"
      },
      {
        "name": "Nexus"
      },
      {
        "name": "Amazon ECR"
      },
      {
        "name": "ArgoCD"
      },
      {
        "name": "ArgoCD Image Updater"
      },
      {
        "name": "Make"
      }
    ]
  },
  {
    "id": "security",
    "title": "Security & DevSecOps",
    "tools": [
      {
        "name": "AWS Certificate Manager"
      },
      {
        "name": "AWS IAM"
      },
      {
        "name": "Trivy"
      },
      {
        "name": "SonarQube"
      },
      {
        "name": "AWS CloudTrail"
      },
      {
        "name": "AWS KMS"
      },
      {
        "name": "Bandit"
      },
      {
        "name": "cert-manager"
      },
      {
        "name": "Hadolint"
      },
      {
        "name": "pip-audit"
      }
    ]
  },
  {
    "id": "observability",
    "title": "Observability & Monitoring",
    "tools": [
      {
        "name": "CloudWatch"
      },
      {
        "name": "Grafana"
      },
      {
        "name": "Prometheus"
      },
      {
        "name": "AlertManager"
      },
      {
        "name": "Elasticsearch"
      },
      {
        "name": "Filebeat"
      },
      {
        "name": "Fluent Bit"
      },
      {
        "name": "Kibana"
      }
    ]
  },
  {
    "id": "runtimes-data",
    "title": "Runtimes, Languages & Data",
    "tools": [
      {
        "name": "Bash"
      },
      {
        "name": "Cloudflare"
      },
      {
        "name": "Nginx"
      },
      {
        "name": "PostgreSQL"
      },
      {
        "name": "Alpine Linux"
      },
      {
        "name": "Cloudflare Tunnel"
      },
      {
        "name": "DynamoDB"
      },
      {
        "name": "Lambda"
      },
      {
        "name": "MkDocs"
      },
      {
        "name": "MySQL"
      },
      {
        "name": "RabbitMQ"
      },
      {
        "name": "Redis"
      },
      {
        "name": "SNS"
      },
      {
        "name": "SQS"
      },
      {
        "name": "systemd"
      },
      {
        "name": "Ubuntu"
      },
      {
        "name": "RHEL / CentOS"
      }
    ]
  }
]

/** Distinct tools on the visible page: evidenced plus trained. */
export const TOTAL_TOOLS = 71

/**
 * Every technology any project uses, showcased or not, for the page's screen-reader
 * keyword block. Recruiter tooling matches on the application layer here without it
 * taking space on the visible page.
 */
export const keywordTechnologies: string[] = [
  "AlertManager",
  "Alpine Linux",
  "Amazon CloudFront",
  "Amazon EBS CSI Driver",
  "Amazon ECR",
  "Amazon ECS",
  "Amazon EKS",
  "Amazon RDS",
  "Amazon Route 53",
  "Amazon S3",
  "ArgoCD",
  "ArgoCD Image Updater",
  "AWS Application Load Balancer",
  "AWS Certificate Manager",
  "AWS CLI",
  "AWS CloudTrail",
  "AWS EC2",
  "AWS IAM",
  "AWS KMS",
  "AWS Load Balancer Controller",
  "Bandit",
  "Bash",
  "cert-manager",
  "Cloudflare",
  "Cloudflare Tunnel",
  "CloudFormation",
  "CloudWatch",
  "Cobertura",
  "Docker",
  "Docker (Buildx & QEMU)",
  "Docker Compose",
  "Docker Hub",
  "DynamoDB",
  "eksctl",
  "Elasticsearch",
  "ESLint",
  "Express",
  "ExternalDNS",
  "Filebeat",
  "Flask",
  "Fluent Bit",
  "Gateway API",
  "GHCR",
  "GitHub Actions",
  "GitHub Pages",
  "Grafana",
  "Gunicorn",
  "Hadolint",
  "Helm",
  "Helmfile",
  "JaCoCo",
  "Java",
  "Jenkins",
  "Jest",
  "Kibana",
  "kubeadm",
  "kubectx",
  "kubens",
  "Kubernetes",
  "Kustomize",
  "Lambda",
  "lychee",
  "Make",
  "Maven",
  "Metrics Server",
  "mike",
  "MkDocs",
  "MySQL",
  "Nexus",
  "Nginx",
  "NGINX Gateway Fabric",
  "Node.js",
  "npm",
  "pip-audit",
  "PostgreSQL",
  "Prometheus",
  "pytest",
  "Python",
  "RabbitMQ",
  "React",
  "Redis",
  "SNS",
  "SonarQube",
  "Spring Boot",
  "SQLite",
  "SQS",
  "systemd",
  "Terraform",
  "Trivy",
  "Ubuntu",
  "Webpack",
  "yq"
]

/** Technologies a project uses that are deliberately not shown. */
export const HIDDEN_TECH_COUNT = 23

/** Tool label to the projects that use it, in upstream order. */
export const toolProjects: Record<string, ProjectRef[]> = {
  "AWS EC2": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "Amazon RDS": [
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "Amazon S3": [
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "AWS Static Hosting",
      "slug": "aws-secure-static-hosting"
    }
  ],
  "Amazon CloudFront": [
    {
      "name": "AWS Static Hosting",
      "slug": "aws-secure-static-hosting"
    }
  ],
  "Amazon Route 53": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "AWS Static Hosting",
      "slug": "aws-secure-static-hosting"
    }
  ],
  "Terraform": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "CloudFormation": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "eksctl": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "Docker": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    },
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    },
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "Docker Compose": [
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "Docker (Buildx & QEMU)": [
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "Amazon EKS": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "Amazon ECS": [
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "kubeadm": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "Kubernetes": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    },
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "Helm": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "Helmfile": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "Kustomize": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "Gateway API": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "AWS Load Balancer Controller": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "AWS Application Load Balancer": [
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "ExternalDNS": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    }
  ],
  "Amazon EBS CSI Driver": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "Metrics Server": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    }
  ],
  "NGINX Gateway Fabric": [
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "Jenkins": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    }
  ],
  "GitHub Actions": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    },
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "ArgoCD": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    }
  ],
  "ArgoCD Image Updater": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    }
  ],
  "GHCR": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    },
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "Docker Hub": [
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    },
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "Nexus": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    }
  ],
  "Amazon ECR": [
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "Maven": [
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    }
  ],
  "Make": [
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "Trivy": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    },
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "SonarQube": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    }
  ],
  "Bandit": [
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    }
  ],
  "pip-audit": [
    {
      "name": "DevSecOps CI Pipelines",
      "slug": "devsecops-pipeline-engineering"
    }
  ],
  "Hadolint": [
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "AWS IAM": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "AWS Static Hosting",
      "slug": "aws-secure-static-hosting"
    }
  ],
  "AWS KMS": [
    {
      "name": "AWS Static Hosting",
      "slug": "aws-secure-static-hosting"
    }
  ],
  "AWS CloudTrail": [
    {
      "name": "AWS Static Hosting",
      "slug": "aws-secure-static-hosting"
    }
  ],
  "AWS Certificate Manager": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "AWS Static Hosting",
      "slug": "aws-secure-static-hosting"
    }
  ],
  "cert-manager": [
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "Prometheus": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "Grafana": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    },
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "AlertManager": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    }
  ],
  "Elasticsearch": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    }
  ],
  "Filebeat": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    }
  ],
  "Kibana": [
    {
      "name": "Microservices GitOps on EKS",
      "slug": "microservices-demo"
    }
  ],
  "Fluent Bit": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "CloudWatch": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "MySQL": [
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "PostgreSQL": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "DynamoDB": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "RabbitMQ": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "Redis": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "SQS": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "SNS": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "Lambda": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    }
  ],
  "Bash": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    },
    {
      "name": "DebugBox",
      "slug": "debugbox"
    },
    {
      "name": "AWS Static Hosting",
      "slug": "aws-secure-static-hosting"
    }
  ],
  "systemd": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    }
  ],
  "Alpine Linux": [
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ],
  "Ubuntu": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    }
  ],
  "Nginx": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    },
    {
      "name": "Polyglot Deployment",
      "slug": "polyglot-monolith-deployment"
    }
  ],
  "Cloudflare": [
    {
      "name": "Retail Store Multi-Env",
      "slug": "retail-store-sample-app"
    },
    {
      "name": "BankApp Java Monolith",
      "slug": "java-monolith"
    }
  ],
  "Cloudflare Tunnel": [
    {
      "name": "SilverStack",
      "slug": "silverstack-cicd-platform"
    }
  ],
  "MkDocs": [
    {
      "name": "DebugBox",
      "slug": "debugbox"
    }
  ]
}

/** How each evidenced tool was matched. Keys mirror `toolProjects`. */
export const evidenceKind: Record<string, EvidenceKind> = {
  "AWS EC2": "tech",
  "Amazon RDS": "tech",
  "Amazon S3": "tech",
  "Amazon CloudFront": "tech",
  "Amazon Route 53": "tech",
  "Terraform": "tech",
  "CloudFormation": "tech",
  "eksctl": "tech",
  "Docker": "tech",
  "Docker Compose": "tech",
  "Docker (Buildx & QEMU)": "tech",
  "Amazon EKS": "tech",
  "Amazon ECS": "tech",
  "kubeadm": "tech",
  "Kubernetes": "tech",
  "Helm": "tech",
  "Helmfile": "tech",
  "Kustomize": "tech",
  "Gateway API": "tech",
  "AWS Load Balancer Controller": "tech",
  "AWS Application Load Balancer": "tech",
  "ExternalDNS": "tech",
  "Amazon EBS CSI Driver": "tech",
  "Metrics Server": "tech",
  "NGINX Gateway Fabric": "tech",
  "Jenkins": "tech",
  "GitHub Actions": "tech",
  "ArgoCD": "tech",
  "ArgoCD Image Updater": "tech",
  "GHCR": "tech",
  "Docker Hub": "tech",
  "Nexus": "tech",
  "Amazon ECR": "tech",
  "Maven": "tech",
  "Make": "tech",
  "Trivy": "tech",
  "SonarQube": "tech",
  "Bandit": "tech",
  "pip-audit": "tech",
  "Hadolint": "tech",
  "AWS IAM": "tech",
  "AWS KMS": "tech",
  "AWS CloudTrail": "tech",
  "AWS Certificate Manager": "tech",
  "cert-manager": "tech",
  "Prometheus": "tech",
  "Grafana": "tech",
  "AlertManager": "tech",
  "Elasticsearch": "tech",
  "Filebeat": "tech",
  "Kibana": "tech",
  "Fluent Bit": "tech",
  "CloudWatch": "tech",
  "MySQL": "tech",
  "PostgreSQL": "tech",
  "DynamoDB": "tech",
  "RabbitMQ": "tech",
  "Redis": "tech",
  "SQS": "tech",
  "SNS": "tech",
  "Lambda": "tech",
  "Bash": "tech",
  "systemd": "tech",
  "Alpine Linux": "tech",
  "Ubuntu": "tech",
  "Nginx": "tech",
  "Cloudflare": "tech",
  "Cloudflare Tunnel": "tech",
  "MkDocs": "tech"
}

/**
 * Tools known from training that no published project demonstrates, with a note on where
 * the knowledge came from. Absent from `toolProjects` by construction, so a tool is
 * never counted as both.
 */
export const trainedTools: Record<string, string> = {
  "Ansible": "From the DevOps Shack bootcamp and KodeKloud labs. Terraform is the evidenced infrastructure-as-code tool.",
  "RHEL / CentOS": "From the Technical Guftgu Linux course. Ubuntu and Alpine are the evidenced distributions."
}

/** Tools on the skills page with at least one project behind them. */
export const EVIDENCED_COUNT = 69

/** Tools on the skills page known from training, with no project behind them. */
export const TRAINED_COUNT = 2

/** Projects flagged `featured: true`, in upstream order. */
export const featuredProjects: FeaturedProject[] = [
  {
    "title": "SilverStack",
    "description": "Built a self-hosted CI/CD platform (Jenkins, SonarQube, Nexus) on iximiuz Labs microVMs with 5 custom OCI rootfs images using systemd as PID 1. Configured Cloudflare Tunnels for CGNAT traversal and published each environment as a publicly accessible playground.",
    "tech": [
      "Docker",
      "Jenkins",
      "SonarQube",
      "Nexus",
      "GitHub Actions"
    ],
    "url": "https://projects.ibtisam-iq.com/silverstack-cicd-platform"
  },
  {
    "title": "Microservices GitOps on EKS",
    "description": "Deployed 10 microservices on Amazon EKS with Terraform, 3 CI pipelines, and fully automated GitOps delivery via ArgoCD Image Updater. Configured Gateway API routing, ExternalDNS, and observability with Prometheus and the Elastic Stack.",
    "tech": [
      "Amazon EKS",
      "Terraform",
      "ArgoCD",
      "Gateway API",
      "Helm"
    ],
    "url": "https://projects.ibtisam-iq.com/microservices-demo"
  },
  {
    "title": "Retail Store Multi-Env",
    "description": "Deployed 5 microservices across bare-metal Kubernetes and Amazon EKS, decoupling all AWS dependencies for portability. Configured IRSA, Helmfile orchestration, a serverless event pipeline (SQS, Lambda, SNS), and CloudWatch logging.",
    "tech": [
      "Amazon EKS",
      "kubeadm",
      "Terraform",
      "Docker",
      "Helmfile"
    ],
    "url": "https://projects.ibtisam-iq.com/retail-store-sample-app"
  },
  {
    "title": "BankApp Java Monolith",
    "description": "Deployed the same Java artifact across EC2, ECS Fargate, and Amazon EKS to compare each compute model firsthand. Shared one VPC and RDS instance across all three and reduced the image by 60% with multi-stage builds.",
    "tech": [
      "Amazon EKS",
      "AWS EC2",
      "Amazon ECS",
      "Terraform",
      "Docker"
    ],
    "url": "https://projects.ibtisam-iq.com/java-monolith"
  },
  {
    "title": "Polyglot Deployment",
    "description": "Containerized three applications (Java, Python, Node.js) and deployed each across EC2, ECS, bare-metal Kubernetes, and EKS. Wrote Kustomize overlays sharing 80% of base manifests between environments.",
    "tech": [
      "Amazon EKS",
      "Docker",
      "Java",
      "Python",
      "Node.js"
    ],
    "url": "https://projects.ibtisam-iq.com/polyglot-monolith-deployment"
  },
  {
    "title": "DevSecOps CI Pipelines",
    "description": "Built one CI pipeline contract for three codebases (14, 16, and 21 stages) and implemented it twice, on Jenkins and GitHub Actions. Integrated Trivy, SonarQube quality gates, and triple-registry publishing with a strict GitOps handoff.",
    "tech": [
      "Jenkins",
      "GitHub Actions",
      "Trivy",
      "SonarQube",
      "Docker"
    ],
    "url": "https://projects.ibtisam-iq.com/devsecops-pipeline-engineering"
  },
  {
    "title": "DebugBox",
    "description": "Built an open-source Kubernetes debugging toolkit with 3 Alpine variants (15MB to 91MB), 93% smaller than netshoot. Automated multi-arch builds with Trivy gating, in-container smoke tests, and a MkDocs documentation site.",
    "tech": [
      "Docker (Buildx & QEMU)",
      "Alpine Linux",
      "Trivy",
      "Hadolint",
      "GitHub Actions"
    ],
    "url": "https://projects.ibtisam-iq.com/debugbox"
  },
  {
    "title": "AWS Static Hosting",
    "description": "Built a zero-compute hosting architecture on AWS using CloudFront OAC with SigV4 signing against a private S3 origin. Configured Cross-Region Replication with dual-KMS encryption, CloudTrail auditing, and Glacier lifecycle policies.",
    "tech": [
      "Amazon CloudFront",
      "AWS Certificate Manager",
      "Amazon S3",
      "AWS KMS",
      "Amazon Route 53"
    ],
    "url": "https://projects.ibtisam-iq.com/aws-secure-static-hosting"
  }
]

/** Projects flagged `homepage: true`, in upstream order. */
export const homepageProjects: FeaturedProject[] = [
  {
    "title": "SilverStack",
    "description": "Built a self-hosted CI/CD platform (Jenkins, SonarQube, Nexus) on iximiuz Labs microVMs with 5 custom OCI rootfs images using systemd as PID 1. Configured Cloudflare Tunnels for CGNAT traversal and published each environment as a publicly accessible playground.",
    "tech": [
      "Docker",
      "Jenkins",
      "SonarQube",
      "Nexus",
      "GitHub Actions"
    ],
    "url": "https://projects.ibtisam-iq.com/silverstack-cicd-platform"
  },
  {
    "title": "Microservices GitOps on EKS",
    "description": "Deployed 10 microservices on Amazon EKS with Terraform, 3 CI pipelines, and fully automated GitOps delivery via ArgoCD Image Updater. Configured Gateway API routing, ExternalDNS, and observability with Prometheus and the Elastic Stack.",
    "tech": [
      "Amazon EKS",
      "Terraform",
      "ArgoCD",
      "Gateway API",
      "Helm"
    ],
    "url": "https://projects.ibtisam-iq.com/microservices-demo"
  },
  {
    "title": "DevSecOps CI Pipelines",
    "description": "Built one CI pipeline contract for three codebases (14, 16, and 21 stages) and implemented it twice, on Jenkins and GitHub Actions. Integrated Trivy, SonarQube quality gates, and triple-registry publishing with a strict GitOps handoff.",
    "tech": [
      "Jenkins",
      "GitHub Actions",
      "Trivy",
      "SonarQube",
      "Docker"
    ],
    "url": "https://projects.ibtisam-iq.com/devsecops-pipeline-engineering"
  },
  {
    "title": "DebugBox",
    "description": "Built an open-source Kubernetes debugging toolkit with 3 Alpine variants (15MB to 91MB), 93% smaller than netshoot. Automated multi-arch builds with Trivy gating, in-container smoke tests, and a MkDocs documentation site.",
    "tech": [
      "Docker (Buildx & QEMU)",
      "Alpine Linux",
      "Trivy",
      "Hadolint",
      "GitHub Actions"
    ],
    "url": "https://projects.ibtisam-iq.com/debugbox"
  }
]

export const projectUrl = (slug: string): string => `${PROJECTS_URL}/${slug}`
