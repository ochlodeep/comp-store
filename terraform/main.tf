terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.3.9"
}

provider "aws" {
  region  = "us-east-1"
}

resource "aws_s3_bucket" "comp_store_site" {
  bucket = "comp-store-site"
  acl    = "public-read"
  # policy = data.aws_iam_policy_document.allow_public_access.json

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "allow_public_access" {
  bucket = aws_s3_bucket.comp_store_site.id
  policy = data.aws_iam_policy_document.allow_public_access.json
}

data "aws_iam_policy_document" "allow_public_access" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    sid = "PublicReadGetObject"

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.comp_store_site.arn}/*",
    ]
  }
}