data "aws_rds_engine_version" "postgresql" {
  engine  = "aurora-postgresql"
  version = "14.6"
}

module "rds-aurora" {
  count = 1

  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "7.6.2"

  name              = "${local.org_id}-${var.environment}-aurorav2-${count.index + 1}"
  engine            = data.aws_rds_engine_version.postgresql.engine
  engine_mode       = "provisioned"
  engine_version    = data.aws_rds_engine_version.postgresql.version
  storage_encrypted = true

  vpc_id                = module.vpc.vpc_id
  subnets               = module.vpc.database_subnets
  create_security_group = true
  allowed_cidr_blocks   = var.is_database_public ? ["0.0.0.0/0"] : module.vpc.private_subnets_cidr_blocks
  publicly_accessible   = var.is_database_public
  monitoring_interval   = 120

  apply_immediately   = var.db_apply_immediately
  skip_final_snapshot = true

  db_parameter_group_name         = aws_db_parameter_group.postgresql14.id
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.postgresql14.id

  serverlessv2_scaling_configuration = {
    min_capacity = var.db_min_capacity
    max_capacity = var.db_max_capacity
  }

  master_password        = var.db_master_password
  master_username        = var.db_master_username
  create_random_password = false

  tags = local.tags

  instance_class = "db.serverless"
  instances = {
    a = {}
    b = {}
  }
}

resource "aws_db_parameter_group" "postgresql14" {
  name        = "${local.org_id}-aurora-db-postgres-parameter-group"
  family      = "aurora-postgresql14"
  description = "${local.org_id}-aurora-db-postgres-parameter-group"
  tags        = local.tags
}

resource "aws_rds_cluster_parameter_group" "postgresql14" {
  name        = "${local.org_id}-aurora-postgres-cluster-parameter-group"
  family      = "aurora-postgresql14"
  description = "${local.org_id}-aurora-postgres-cluster-parameter-group"
  tags        = local.tags
}
