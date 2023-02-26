#region
variable "aws_region" {
  description = "AWS region"
  default     = "ca-central-1"
}

# AWS Credentials
variable "aws_access_keys" {
  type        = map(string)
  description = "Key used to access AWS resources"
  sensitive   = true
}

variable "aws_secret_keys" {
  type        = map(string)
  description = "Secret key used to access AWS resources"
  sensitive   = true
}

variable "vpc_cidrs" {
  type        = map(string)
  description = "CIDR block for vpc per environment"
}

# Database 
variable "are_databases_public" {
  type = map(bool)
}

variable "db_min_capacities" {
  type        = map(number)
  description = "Minimum capacity for the database"
}

variable "db_max_capacities" {
  description = "Maximum capacity for the database"
  default     = 2
}

variable "db_passwords" {
  type        = map(string)
  description = "Password for the databases in each environment"
  sensitive   = true
}

variable "db_usernames" {
  type        = map(string)
  description = "Username for the databases in each environment"
}

variable "should_db_changes_apply_immediately" {
  type        = map(bool)
  description = "Should we apply changes immediately to the database in each environment"
}
