module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.19.0"

  name                                   = "vpc-${var.environment}"
  azs                                    = ["${var.aws_region}a", "${var.aws_region}b"]
  cidr                                   = var.vpc_cidr
  public_subnets                         = [cidrsubnet(var.vpc_cidr, 8, 0), cidrsubnet(var.vpc_cidr, 8, 1)]
  private_subnets                        = [cidrsubnet(var.vpc_cidr, 8, 100), cidrsubnet(var.vpc_cidr, 8, 101)]
  database_subnets                       = [cidrsubnet(var.vpc_cidr, 8, 200), cidrsubnet(var.vpc_cidr, 8, 201)]
  create_database_subnet_group           = true
  create_database_subnet_route_table     = true
  create_database_internet_gateway_route = var.is_database_public

  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = local.tags
}
