locals {
  aws_access_key       = var.aws_access_keys[terraform.workspace]
  aws_secret_key       = var.aws_secret_keys[terraform.workspace]
  db_apply_immediately = var.should_db_changes_apply_immediately[terraform.workspace]
  db_max_capacity      = var.db_max_capacities[terraform.workspace]
  db_min_capacity      = var.db_min_capacities[terraform.workspace]
  db_password          = var.db_passwords[terraform.workspace]
  db_username          = var.db_usernames[terraform.workspace]
  environment          = terraform.workspace
  is_database_public   = var.are_databases_public[terraform.workspace]
  org_id               = "dm"
  organization         = "DevMastery"
  vpc_cidr             = var.vpc_cidrs[terraform.workspace]
  tags = {
    Environment  = terraform.workspace
    Organization = local.organization
  }
}
