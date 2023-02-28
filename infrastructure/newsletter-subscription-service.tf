###############################################################################
# API LAMBDAS
###############################################################################
data "template_file" "openapi_spec" {
  template = file("../newsletter-subscription/api-spec/newsletter-subscription-api.yaml")

  vars = {
    createNewsletterSubscriptionUri = module.lambda_create_newsletter_subscription.lambda_function_invoke_arn
  }
}

locals {
  http_lambda_source_path = "./lambda/http"
  lambda_runtime          = "nodejs16.x"
}

module "lambda_create_newsletter_subscription" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "4.10.1"

  function_name = "createNewsletterSubscription"
  description   = "Handles newsletter subscription requests"
  handler       = "index.handler"
  runtime       = local.lambda_runtime
  source_path   = local.http_lambda_source_path

  tags = local.tags

  # ignore_source_code_hash = true

  # vpc_subnet_ids         = module.vpc.private_subnets
  # vpc_security_group_ids = [module.vpc.default_security_group_id]
  # attach_network_policy  = true
}

###############################################################################
# API GATEWAY
###############################################################################

resource "aws_api_gateway_rest_api" "newsletter_subscription_api" {
  name        = "newsletter-subscription-api"
  description = "A service for subscribing to newsletters"
  body        = data.template_file.openapi_spec.rendered
}

resource "aws_api_gateway_deployment" "newsletter_subscription_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.newsletter_subscription_api.id

  triggers = {
    redeployment = sha1(data.template_file.openapi_spec.rendered)
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "newsletter_subscription_api_stage" {
  deployment_id = aws_api_gateway_deployment.newsletter_subscription_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.newsletter_subscription_api.id
  stage_name    = var.environment
}


resource "aws_lambda_permission" "api_gateway_invoke_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_create_newsletter_subscription.lambda_function_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.aws_account_id}:${aws_api_gateway_rest_api.newsletter_subscription_api.id}/*/*"
}
