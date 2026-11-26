terraform {
  required_version = ">= 1.10.0" # OpenTofu; 1.10+ for native S3 state locking

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Partial configuration: the real values live in backend.hcl, which is
  # gitignored. Run: tofu init -backend-config=backend.hcl
  backend "s3" {}
}
