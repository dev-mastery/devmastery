##############################################################################
# ORGANIZATION AND TAGS
##############################################################################

locals {
  org_id       = "dm"
  organization = "DevMastery"
  tags = {
    Environment  = var.environment
    Organization = local.organization
  }
}


##############################################################################
# NETWORKING
##############################################################################

locals {
  azs = ["${var.aws_region}a", "${var.aws_region}b"]
  subnets = {
    public   = [cidrsubnet(var.vpc_cidr, 8, 0), cidrsubnet(var.vpc_cidr, 8, 1)]
    private  = [cidrsubnet(var.vpc_cidr, 8, 100), cidrsubnet(var.vpc_cidr, 8, 101)]
    database = [cidrsubnet(var.vpc_cidr, 8, 200), cidrsubnet(var.vpc_cidr, 8, 201)]
  }
}
