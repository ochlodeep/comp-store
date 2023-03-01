resource "aws_lambda_function_url" "url" {
  function_name      = aws_lambda_function.service.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}

resource "aws_lambda_function_url" "url_load" {
  function_name      = aws_lambda_function.service_load.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}

data "archive_file" "local_zipped_lambda" {
  type        = "zip"
  source_dir = "${path.module}/lambda"
  output_path = "${path.module}/lambda.zip"
}

data "archive_file" "local_zipped_lambda_load" {
  type        = "zip"
  source_dir = "${path.module}/lambda_load"
  output_path = "${path.module}/lambda_load.zip"
}

resource "aws_s3_bucket_object" "zipped_lambda" {
  bucket = "${aws_s3_bucket.lambda_storage.bucket}"
  key    = "lambda.zip"
  source = "${data.archive_file.local_zipped_lambda.output_path}"
}

resource "aws_s3_bucket_object" "zipped_lambda_load" {
  bucket = "${aws_s3_bucket.lambda_storage.bucket}"
  key    = "lambda_load.zip"
  source = "${data.archive_file.local_zipped_lambda_load.output_path}"
}

resource "aws_s3_bucket" "lambda_storage" {
  bucket = "tf-${var.name}-storage"
}

resource "aws_lambda_function" "service" {
  function_name = "tf-${var.name}"

  s3_bucket = "${aws_s3_bucket.lambda_storage.bucket}"
  s3_key    = "${aws_s3_bucket_object.zipped_lambda.key}"

  handler     = "src/lambda.handler"
  runtime     = "nodejs16.x"
  role        = "${aws_iam_role.service.arn}"
  source_code_hash = data.archive_file.local_zipped_lambda.output_base64sha256

  vpc_config {
    subnet_ids = "${module.vpc.private_subnets}"
    security_group_ids = ["${aws_security_group.service.id}"]
  }

  environment {
    variables = {
      DB_CONNECTION_STRING = "mongodb://${aws_docdb_cluster.service.master_username}:${aws_docdb_cluster.service.master_password}@${aws_docdb_cluster.service.endpoint}:${aws_docdb_cluster.service.port}"
      DB_NAME = "test"
      COLLECTION_NAME = "laptops"
    }
  }
}

resource "aws_lambda_function" "service_load" {
  function_name = "tf-${var.name}-load"

  s3_bucket = "${aws_s3_bucket.lambda_storage.bucket}"
  s3_key    = "${aws_s3_bucket_object.zipped_lambda_load.key}"

  handler     = "src/load.handler"
  runtime     = "nodejs16.x"
  role        = "${aws_iam_role.service.arn}"
  source_code_hash = data.archive_file.local_zipped_lambda_load.output_base64sha256

  vpc_config {
    subnet_ids = "${module.vpc.private_subnets}"
    security_group_ids = ["${aws_security_group.service.id}"]
  }

  environment {
    variables = {
      DB_CONNECTION_STRING = "mongodb://${aws_docdb_cluster.service.master_username}:${aws_docdb_cluster.service.master_password}@${aws_docdb_cluster.service.endpoint}:${aws_docdb_cluster.service.port}"
      DB_NAME = "test"
      COLLECTION_NAME = "laptops"
    }
  }
}

resource "aws_iam_role" "service" {
  name = "tf-${var.name}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "service" {
  name = "tf-${var.name}"
  role = "${aws_iam_role.service.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:*",
        "ec2:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "service" {
  name = "tf-${var.name}"
  path = "/"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "service" {
  role       = "${aws_iam_role.service.name}"
  policy_arn = "${aws_iam_policy.service.arn}"
}
