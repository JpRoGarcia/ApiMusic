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
      description      = ""
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
    }
  ]
  ingress = [
    {
      description      = ""
      from_port        = 22
      to_port          = 22
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", ]
    },
    {

      description      = ""
      from_port        = 80
      to_port          = 80
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", ]
    },
    {
    description = "Allow PostgreSQL connections from EC2 instances"
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
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
# use data source to get all avalablility zones in region
data "aws_availability_zones" "available_zones" {}


# create a default subnet in the first az if one does not exit
resource "aws_default_subnet" "subnet_az1" {
  availability_zone = data.aws_availability_zones.available_zones.names[0]
}

# create a default subnet in the second az if one does not exit
resource "aws_default_subnet" "subnet_az2" {
  availability_zone = data.aws_availability_zones.available_zones.names[1]
}

# create the subnet group for the rds instance
resource "aws_db_subnet_group" "database_subnet_group" {
  name         = "database-subnets"
  subnet_ids   = [aws_default_subnet.subnet_az1.id, aws_default_subnet.subnet_az2.id]
  description  = "Subnets for database instances"

  tags   = {
    Name = "database-subnets"
  }
}


# create the rds instance
resource "aws_db_instance" "db_instance" {
  engine                  = "postgres"
  engine_version          = "15.3"
  multi_az                = false
  identifier              = "dev-rds-instance"
  username                = "ApiMusicUser"
  password                = "ApiMusicPassword"
  instance_class          = "db.t3.micro"
  allocated_storage       = 200
  db_subnet_group_name    = aws_db_subnet_group.database_subnet_group.name
  vpc_security_group_ids  = aws_security_group.maingroup.id
  availability_zone       = data.aws_availability_zones.available_zones.names[0]
  db_name                 = "ApiMusicData"
  skip_final_snapshot     = true

    # Cargar SQL después de crear la instancia
  provisioner "local-exec" {
    command = "psql -h ${aws_db_instance.db_instance.address} -U ${aws_db_instance.db_instance.username} -p ${aws_db_instance.db_instance.port} -d ${aws_db_instance.db_instance.name} < create_table.sql"
  }
}



