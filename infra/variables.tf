variable "domain_name" {
  description = "Apex domain registered in Route 53, e.g. example.com. The www subdomain redirects here."
  type        = string
}

variable "github_repository" {
  description = "GitHub repository allowed to deploy, as owner/name."
  type        = string

  validation {
    condition     = can(regex("^[A-Za-z0-9-]+/[A-Za-z0-9._-]+$", var.github_repository))
    error_message = "Use the form owner/name."
  }
}

variable "budget_alert_email" {
  description = "Email address that receives AWS cost alerts. Set in terraform.tfvars (gitignored)."
  type        = string
  sensitive   = true
}

variable "monthly_budget_usd" {
  description = "Monthly AWS spend that triggers an alert."
  type        = number
  default     = 5
}

variable "aws_region" {
  description = "Region for the site bucket."
  type        = string
  default     = "ca-central-1"
}
