locals {
  # Shared with `vite preview` so tests run under the production policy.
  security_headers = jsondecode(file("${path.module}/../security-headers.json"))
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "personal-website"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_response_headers_policy" "security" {
  #checkov:skip=CKV_AWS_259:False positive. HSTS is set below from security-headers.json (2 years, subdomains, preload); checkov cannot resolve file() values
  name = "personal-website-security-headers"

  security_headers_config {
    content_security_policy {
      content_security_policy = local.security_headers.contentSecurityPolicy
      override                = true
    }
    strict_transport_security {
      access_control_max_age_sec = local.security_headers.hstsMaxAgeSeconds
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = local.security_headers.referrerPolicy
      override        = true
    }
  }

  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = local.security_headers.permissionsPolicy
      override = true
    }
  }
}

# Redirect www.<domain> to the apex domain so the site has one canonical URL.
resource "aws_cloudfront_function" "redirect_www" {
  name    = "personal-website-redirect-www"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-JS
    function handler(event) {
      var request = event.request;
      var host = request.headers.host && request.headers.host.value;
      if (host === "${local.www_domain}") {
        return {
          statusCode: 301,
          statusDescription: "Moved Permanently",
          headers: { location: { value: "https://${var.domain_name}" + request.uri } }
        };
      }
      return request;
    }
  JS
}

resource "aws_cloudfront_distribution" "site" {
  #checkov:skip=CKV_AWS_68:Static site with no server-side code or forms; WAF costs more than the whole site (D9)
  #checkov:skip=CKV2_AWS_47:See CKV_AWS_68 (no WAF, no Java backend) (D9)
  #checkov:skip=CKV_AWS_86:Access logging skipped to keep cost and personal data collection at zero (D9)
  #checkov:skip=CKV_AWS_374:The site is meant to be reachable worldwide (D9)
  #checkov:skip=CKV_AWS_310:Single S3 origin with 11 nines durability; failover origin not needed (D9)
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  comment             = "personal-website"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # North America and Europe edge locations
  aliases             = [var.domain_name, local.www_domain]

  origin {
    origin_id                = "s3-site"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id           = "s3-site"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirect_www.arn
    }
  }

  # S3 returns 403 for missing objects when the bucket is private.
  dynamic "custom_error_response" {
    for_each = [403, 404]
    content {
      error_code            = custom_error_response.value
      response_code         = 404
      response_page_path    = "/404.html"
      error_caching_min_ttl = 60
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
