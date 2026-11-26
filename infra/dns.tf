# The hosted zone is created automatically when you register the domain in
# Route 53 (see docs/SETUP.md), so it is looked up here, not managed.
data "aws_route53_zone" "site" {
  name         = var.domain_name
  private_zone = false
}

locals {
  www_domain = "www.${var.domain_name}"
}

resource "aws_acm_certificate" "site" {
  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = [local.www_domain]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id         = data.aws_route53_zone.site.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 300
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "site" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

resource "aws_route53_record" "site" {
  for_each = toset(flatten([
    for name in [var.domain_name, local.www_domain] : [
      for type in ["A", "AAAA"] : "${name}|${type}"
    ]
  ]))

  zone_id = data.aws_route53_zone.site.zone_id
  name    = split("|", each.key)[0]
  type    = split("|", each.key)[1]

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}
