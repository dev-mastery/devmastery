resource "aws_amplify_app" "portal" {
  name        = "devmastery-portal-${var.environment}"
  description = "The Dev Mastery portal"

  repository = "https://github.com/dev-mastery/devmastery"

  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "portal"
    ENV                       = var.environment
  }

  build_spec = <<-EOT
    version: 1
    applications:
      - appRoot: portal
        frontend:
          phases:
            preBuild:
              commands:
                - npm install 
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: .next
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
  EOT

  platform = "WEB"
  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }
}

# resource "aws_amplify_branch" "prod" {
#   app_id      = aws_amplify_app.portal.id
#   branch_name = "main"

#   framework = "Next.js"
#   stage     = "PRODUCTION"
# }

resource "aws_amplify_branch" "dev" {
  app_id      = aws_amplify_app.portal.id
  branch_name = "dev"

  stage             = "DEVELOPMENT"
  enable_auto_build = true
}
