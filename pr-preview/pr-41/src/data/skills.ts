export interface Tool {
  name: string;
}

export interface Category {
  title: string;
  tools: Tool[];
}

export const categories: Category[] = [
  {
    title: "Containers & Orchestration",
    tools: [
      { name: "Docker" },
      { name: "Docker Compose" },
      { name: "Docker Buildx" },
      { name: "Kubernetes" },
      { name: "kubeadm" },
      { name: "Helm" },
      { name: "Helmfile" },
      { name: "Kustomize" },
      { name: "ArgoCD" },
      { name: "Gateway API" },
      { name: "ExternalDNS" },
    ],
  },
  {
    title: "CI/CD & Automation",
    tools: [
      { name: "Jenkins" },
      { name: "GitHub Actions" },
      { name: "SonarQube" },
      { name: "Nexus" },
      { name: "Azure DevOps" },
      { name: "Maven" },
      { name: "Make" },
    ],
  },
  {
    title: "Cloud (AWS)",
    tools: [
      { name: "EC2 & VPC" },
      { name: "IAM" },
      { name: "EKS" },
      { name: "ECS" },
      { name: "S3" },
      { name: "Route 53" },
      { name: "CloudFront" },
      { name: "ACM" },
      { name: "KMS" },
      { name: "CloudFormation" },
      { name: "eksctl" },
      { name: "RDS" },
      { name: "DynamoDB" },
      { name: "SQS" },
      { name: "Lambda" },
      { name: "SNS" },
      { name: "CodeCommit & CodeDeploy" },
    ],
  },
  {
    title: "IaC & Scripting",
    tools: [
      { name: "Bash" },
      { name: "Terraform" },
      { name: "Ansible" },
      { name: "Cloudflare Tunnel" },
      { name: "AWS CLI" },
    ],
  },
  {
    title: "Linux & OS",
    tools: [
      { name: "Ubuntu / Debian" },
      { name: "RHEL / CentOS" },
      { name: "Alpine Linux" },
      { name: "systemd" },
      { name: "Nginx" },
      { name: "Networking" },
    ],
  },
  {
    title: "Security & Supply Chain",
    tools: [
      { name: "Trivy" },
      { name: "Gitleaks" },
      { name: "Hadolint" },
      { name: "cosign" },
      { name: "syft" },
    ],
  },
  {
    title: "Observability",
    tools: [
      { name: "Prometheus" },
      { name: "Grafana" },
      { name: "AlertManager" },
      { name: "Elasticsearch" },
      { name: "Kibana" },
      { name: "Filebeat" },
      { name: "Fluent Bit" },
      { name: "CloudWatch" },
    ],
  },
  {
    title: "Data & Middleware",
    tools: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "Redis" },
      { name: "RabbitMQ" },
    ],
  },
  {
    title: "Documentation",
    tools: [
      { name: "MkDocs" },
      { name: "Markdown" },
      { name: "Runbook authoring" },
    ],
  },
];

// Single source of truth for the tool count shown on the homepage and /skills
export const TOTAL_TOOLS = new Set(
  categories.flatMap((c) => c.tools.map((t) => t.name))
).size;
