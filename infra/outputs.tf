# These values go into the GitHub "production" environment as secrets
# (docs/SETUP.md, step 8). Print them locally; never paste them into the repo.
output "site_url" {
  value = "https://${var.domain_name}"
}

output "site_bucket" {
  value = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "deploy_role_arn" {
  value = aws_iam_role.deploy.arn
}
