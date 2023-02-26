###############################################################################
# API LAMBDAS
###############################################################################
locals {
  source_path = "../newsletter-subscription/handlers/dist/on-newsletter-subscription-requested"
}

module "lambda-newsletter-subscription-request-handler" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "4.10.1"

  function_name = "handleNewsletterSubscriptionRequest"
  description   = "Handles newsletter subscription requests"
  handler       = "index.on-newsletter-subscription-requested"
  runtime       = "nodejs16.x"
  source_path   = local.source_path

  tags = local.tags

  ignore_source_code_hash = true

  vpc_subnet_ids         = module.vpc.private_subnets
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  attach_network_policy  = true
}

###############################################################################
# API GATEWAY
###############################################################################

# resource "aws_api_gateway_rest_api" "newsletter_subscription_api" {
#   name        = "newsletter-subscription-api"
#   description = "A service for subscribing to newsletters"
#   body        = file("../newsletter-subscription/api-spec/newsletter-subscription-api.yaml")
# }

# resource "aws_api_gateway_deployment" "newsletter_subscription_api_deployment" {
#   rest_api_id = aws_api_gateway_rest_api.newsletter_subscription_api.id

#   triggers = {
#     redeployment = sha1(jsonencode(aws_api_gateway_rest_api.newsletter_subscription_api.body))
#   }

#   lifecycle {
#     create_before_destroy = true
#   }
# }

# resource "aws_api_gateway_stage" "newsletter_subscription_api_stage" {
#   deployment_id = aws_api_gateway_deployment.newsletter_subscription_api_deployment.id
#   rest_api_id   = aws_api_gateway_rest_api.newsletter_subscription_api.id
#   stage_name    = var.environment
# }
