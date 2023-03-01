output "url" {
  value = "${aws_lambda_function_url.url.function_url}"
}

output "url_load" {
  value = "${aws_lambda_function_url.url_load.function_url}"
}

output "docdb_username" {
  value = "${aws_docdb_cluster.service.master_username}"
}

# output "comp_storage_bucket" {
#   value = "${aws_s3_bucket.comp_storage.bucket}"
# }

# output "comp_storage_bucket_key" {
#   value = "${aws_s3_bucket_object.seed_data}"
# }

output "comp_store_site_bucket" {
  value = "${aws_s3_bucket.comp_store_site.bucket}"
}

output "lambda_storage_bucket" {
  value = "${aws_s3_bucket.lambda_storage.bucket}"
} 

output "lambda_bucket_key" {
  value = "${aws_s3_bucket_object.zipped_lambda.key}"
}

output "name" {
  value = "${var.name}"
}