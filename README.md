# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

* website url: http://comp-store-site.s3-website-us-east-1.amazonaws.com/
* github url: https://github.com/ochlodeep/comp-store


## Environent Setup
env vars:
* TF_VAR_docdb_password (DocumentDB password)

aws credentials needed:
* aws_access_key_id
* aws_secret_access_key
* default region

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

Copies the contents of the `build` folder to the s3 bucket where the site is hosted.

## Terraform

AWS Infrastructure built using terraform. Endpoint is a lambda function which queries DocumentDB for data. Can be created using `terraform init/plan/apply` in the `terraform` folder.

Updating lambda function code didn't work consistently so resorted to manually zipping lambda function code `zip -r lambda.zip ./lambda` and deploying using the aws cli with `aws lambda update-function-code --function-name tf-comp-store-api --zip-file fileb://lambda.zip`.

Even this method sometimes used older versions of the code so it had to be uploaded in the AWS console.

## Seeding Data

Since DocumentDB only allows connections from other resources in the same VPC, I attempted to import data using the `load.js` script after using an ec2 instance in the same VPC as a jump box but ran into an error related to SSH. In the interest of time, I instead opted to SSH into the ec2 instance and manually download the seed data from s3 and import it to the DocumentDB cluster.

## Improvements in Production

### Code Quality

For the endpoint, code calling the database would need to be refactored for re-use and testing. On the frontend, storybook could be used to develop UI elements in isolation.

### Proper CI/CD flow

Using Gitlab/ AWS Amplify/ etc. to set up automated testing and deployments as well as running all code in docker containers.

### Performance

Set up CloudFront to serve website and compare cost/performance of lambda to always-on ec2 instance.

