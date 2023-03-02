###############################################################################
# ENVIRONMENT
###############################################################################

variable "environment" {
  type        = string
  description = "Environment"
}


###############################################################################
# AWS REGION AND CREDENTIALS
###############################################################################

variable "aws_region" {
  description = "AWS region"
  default     = "ca-central-1"
}

variable "aws_account_id" {
  description = "AWS account ID"
}

variable "aws_access_key" {
  type        = string
  description = "Key used to access AWS resources"
  sensitive   = true
}

variable "aws_secret_key" {
  type        = string
  description = "Secret key used to access AWS resources"
  sensitive   = true
}


###############################################################################
# NETWORKING
###############################################################################

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for vpc"
}


###############################################################################
# DATABASE
###############################################################################

variable "is_database_public" {
  type = bool
}

variable "db_min_capacity" {
  type        = number
  description = "Minimum capacity for the database"
}

variable "db_max_capacity" {
  type        = number
  description = "Maximum capacity for the database"
}

variable "db_master_password" {
  type        = string
  description = "Password for the databases"
  sensitive   = true
}

variable "db_master_username" {
  type        = string
  description = "Username for the databases"
  sensitive   = true
}

variable "db_apply_immediately" {
  type        = bool
  description = "Should we apply changes immediately to the database"
}

###############################################################################
# GITHUB
###############################################################################

variable "gh_amplify_token" {
  type        = string
  description = "GitHub Access Token for AWS Amplify"
  sensitive   = true
}

###############################################################################
# AMPLIFY
###############################################################################

variable "amplify_username" {
  type        = string
  description = "Username for feature branches in amplify"
  sensitive   = true
}

variable "amplify_password" {
  type        = string
  description = "Password for feature branches in amplify"
  sensitive   = true
}
