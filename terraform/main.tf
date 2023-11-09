terraform {
    required_providers{
        aws = {
            source = "hashicorp/aws"
            version = "~>4.0"
        }
    }
    backend "s3" {
      key = "aws/ec2-deploy/terraform.tfstate"
    }
}

provider "aws" {
  region = var.region
}

resource "aws_instance" "servernode" {
  ami = "ami-0fc5d935ebf8bc3bc"
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.maingroup.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2-profile.name
  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ubuntu"
    private_key = var.private_key
    timeout     = "4m"
  }
  tags = {
    "name" = "DeployVM"
  }
}

resource "aws_iam_instance_profile" "ec2-profile" {
  name = "ec2-profile"
  role = "EC2-ECR-AUTH" 
}

resource "aws_security_group" "maingroup" {
  egress = [
    {
      cidr_blocks      = ["0.0.0.0/0"]
      description      = ""
      from_port        = 0
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "-1"
      security_groups  = []
      self             = false
      to_port          = 0
    }
  ]
  ingress = [
    {
      cidr_blocks      = ["0.0.0.0/0", ]
      description      = ""
      from_port        = 22
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "tcp"
      security_groups  = []
      self             = false
      to_port          = 22
    },
    {
      cidr_blocks      = ["0.0.0.0/0", ]
      description      = ""
      from_port        = 80
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "tcp"
      security_groups  = []
      self             = false
      to_port          = 80
    }
  ]
}

resource "aws_key_pair" "deployer" {
  key_name   = var.key_name
  public_key = var.public_key
}
output "instance_public_ip" {
  value     = aws_instance.servernode.public_ip
  sensitive = true
}


#RBS
resource "aws_rds_instance" "my_rds_instance" {
  engine = "postgres"
  instance_class = "db.t2.micro"
  database_name = "ApiMusicData"
  username = "ApiMusicUser"
  password = "ApiMusicPassword"
  allocated_storage = 5
  storage_type = "gp2"
  publicly_accessible = true
}

resource "aws_security_group" "my_rds_security_group" {
  name = "my_rds_security_group"
  description = "Security group for PostgreSQL instance"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "Allow PostgreSQL connections from EC2 instances"
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance_parameter_group" "my_db_parameter_group" {
  name = "my_db_parameter_group"
  family = "postgres12"

  parameter {
    name = "rds.force_ssl"
    value = "1"
  }
}
