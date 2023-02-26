##################################################################################
# TERRAFORM CONFIG
##################################################################################

terraform {
  cloud {
    organization = "devmastery"

    workspaces {
      name = "dev"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

##################################################################################
# PROVIDERS
##################################################################################

provider "aws" {
  region     = var.aws_region
  access_key = local.aws_access_key
  secret_key = local.aws_secret_key
}
