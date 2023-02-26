locals {
  org_id       = "dm"
  organization = "DevMastery"
  tags = {
    Environment  = var.environment
    Organization = local.organization
  }
}
