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
