provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "personal-website"
      ManagedBy = "opentofu"
    }
  }
}

# CloudFront only accepts ACM certificates from us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "personal-website"
      ManagedBy = "opentofu"
    }
  }
}
