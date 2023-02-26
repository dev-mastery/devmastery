###############################################################################
# TERRAFORM CONFIG
###############################################################################

terraform {
  cloud {
    organization = "devmastery"

    workspaces {
      name = "base"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

###############################################################################
# PROVIDERS
###############################################################################

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
