###############################################################################
# API GATEWAY
###############################################################################

resource "aws_api_gateway_rest_api" "newsletter_subscription_api" {
  name        = "newsletter-subscription-api"
  description = "A service for subscribing to newsletters"
  body        = jsonencode(file("../newsletter-subscription/api-spec/newsletter-subscription-api.yaml"))
}

resource "aws_api_gateway_deployment" "newsletter_subscription_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.newsletter_subscription_api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.newsletter_subscription_api.body))
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
