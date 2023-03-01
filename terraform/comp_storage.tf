# data "archive_file" "local_zipped_seed_data" {
#   type        = "zip"
#   source_dir = "${path.module}/data"
#   output_path = "${path.module}/seed_data.zip"
# }

# resource "aws_s3_bucket_object" "seed_data" {
#   bucket = "${aws_s3_bucket.comp_storage.bucket}"
#   key    = "seed_data.zip"
#   source = "${data.archive_file.local_zipped_seed_data.output_path}"
# }

# resource "aws_s3_bucket" "comp_storage" {
#   bucket = "tf-comp-storage"
# }