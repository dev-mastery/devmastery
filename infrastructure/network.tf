###############################################################################
# VPC AND SUBNETS
###############################################################################

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.19.0"

  name                                   = "vpc-${var.environment}"
  azs                                    = local.azs
  cidr                                   = var.vpc_cidr
  public_subnets                         = local.subnets.public
  private_subnets                        = local.subnets.private
  database_subnets                       = local.subnets.database
  create_database_subnet_group           = true
  create_database_subnet_route_table     = true
  create_database_internet_gateway_route = var.is_database_public

  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = local.tags
}

###############################################################################
# CDN
###############################################################################

# module "cdn" {
#   source = "terraform-aws-modules/cloudfront/aws"

#   aliases         = ["dev.devmastery.com"]
#   enabled         = true
#   is_ipv6_enabled = true
#   price_class     = "PriceClass_100"

#   create_origin_access_identity = true
#   origin_access_identities = {
#     newsletter_newsletter_subscription_api = {
#       comment = "Access to newsletter subscription API"
#     }
#   }

#   origin = {
#     newsletter_subscription_api = {
#       domain_name = aws_api_gateway_deployment.newsletter_subscription_api_deployment.invoke_url
#       origin_path = "/${var.environment}"
#       origin_id   = "newsletter_subscription_api"

#       custom_origin_config = {
#         http_port              = 80
#         https_port             = 443
#         origin_protocol_policy = "https-only"
#         origin_ssl_protocols   = ["TLSv1.2"]
#       }
#     }
#   }

#   ordered_cache_behavior = [{
#     path_pattern     = "/api/*"
#     target_origin_id = "newsletter_subscription_api"

#     allowed_methods = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
#     cached_methods  = ["GET", "HEAD"]
#     compress        = true
#     query_string    = true
#   }]
# }
