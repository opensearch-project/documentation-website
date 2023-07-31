---
layout: default
title: Schedule reports with AWS Lambda
nav_order: 30
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /dashboards/reporting-cli/rep-cli-lambda/
---

# Scheduling reports with AWS Lambda

You can use AWS Lambda with the Reporting CLI tool to specify an AWS Lambda function to trigger the report generation.

This requires that you use an AMD64 system and Docker.

### Prerequisites

To use the Reporting CLI with AWS Lambda, you need to do the following preliminary steps.

- Get an AWS account. For instructions, see [Creating an AWS account](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html) in the AWS Account Management reference guide.
- Set up an Amazon Elastic Container Registry (ECR). For instructions, see [Getting started with Amazon ECR using the AWS Management Console](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-console.html).

## Step 1: Create a container image with a Dockerfile

You need to assemble the container image by running a Dockerfile. When you run the Dockerfile, it downloads the OpenSearch artifact required to use the Reporting CLI. To learn more about Dockerfiles, see [Dockerfile reference](https://docs.docker.com/engine/reference/builder/).

Copy the following sample configurations into a Dockerfile:

```dockerfile
# Define function directory
ARG FUNCTION_DIR="/function"

# Base image of the docker container
FROM node:lts-slim as build-image

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# AWS Lambda runtime dependencies
RUN apt-get update && \
    apt-get install -y \
        g++ \
        make \
        unzip \
        libcurl4-openssl-dev \
        autoconf \
        automake \
        libtool \
        cmake \
        python3 \
        libkrb5-dev \
        curl

# Copy function code
WORKDIR ${FUNCTION_DIR}
RUN npm install @opensearch-project/reporting-cli && npm install aws-lambda-ric

# Build Stage 2: Copy Build Stage 1 files in to Stage 2. Install chrome, then remove chrome to keep the dependencies.
FROM node:lts-slim
# Include global arg in this stage of the build
ARG FUNCTION_DIR
# Set working directory to function root directory
WORKDIR ${FUNCTION_DIR}
# Copy in the build image dependencies
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

# Install latest chrome dev package and fonts to support major char sets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && apt-get remove -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]

ENV HOME="/tmp"
CMD [ "/function/node_modules/@opensearch-project/reporting-cli/src/index.handler" ]

```

Next, run the following build command within the same directory that contains the Dockerfile:

```
docker build -t opensearch-reporting-cli .
```

## Step 2: Create a private repository with Amazon ECR

You need to follow the instructions to create an image repository, see [Getting started with Amazon ECR using the AWS Management Console](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-console.html).

Give your repository the name `opensearch-reporting-cli`.

In addition to the Amazon ECR instructions, you need to make several adjustments for the Reporting CLI to function properly as described in the following steps in this procedure.

## Step 3: Push the image to the private repository

You need to get several commands from the AWS ECR Console to run within the Dockerfile directory.

1. After you create your repository, select it from **Private repositories**.
1. Choose **view push commands**.
1. Copy and run each command shown in **Push commands for opensearch-reporting-cli** sequentially in the Dockerfile directory.

For more details about Docker push commands, see [Pushing a Docker image](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html) in the Amazon ECR user guide.

## Step 4: Create a Lambda function with the container image

Now that you have a container image created for the Reporting CLI, you need to create a function defined as the container image.

1. Open the AWS Lambda console and choose [Functions](https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions).
1. Choose **Create function**, then choose **Container image** and fill in a name for the function.
1. In **Container image URI**, choose **Browse images** and select `opensearch-reporting-cli` for the image repository.
1. In **Images** select the image, and choose **Select image**.
1. In **Architecture**, choose **x86_64**.
1. Choose **Create function**.
1. Go to **Lambda** > **functions** and choose the function you created.
1. Choose **Configuration > General configuration > Edit timeout** and set the timeout in lambda to 5 minutes to allow the Reporting CLI to generate the report.
1. Change the **Ephemeral storage** setting to at least 1024MB. The default setting is not a sufficient storage amount to support report generation.

1. Next, test the function either by providing values JSON format or by providing AWS Lambda environment variables.

- If the function contains fixed values, such as email address you do not need a JSON file. You can specify an environment variable in AWS Lambda.
- If the function takes a variable key-value pair, then you need to specify the values in the JSON with the same naming convention as command options, for example the `--credentials` option requires the username and password.
{: .note }

 The following example shows fixed values provided for the sender and recipient email addresses:

```json
{
  "url": "https://playground.opensearch.org/app/dashboards#/view/084aed50-6f48-11ed-a3d5-1ddbf0afc873",
  "transport": "ses",
  "from": "sender@amazon.com", 
  "to": "recipient@amazon.com", 
  "subject": "Test lambda docker image"
}
```

To learn more about AWS Lambda functions, see [Deploying Lambda functions as container images](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-images.html) in the AWS Lambda documentation.
## Step 5: Add the trigger to start the AWS Lambda function

Set the trigger to start running the report. AWS Lambda can use any AWS service as a trigger, such as SNS, S3, or an AWS CloudWatch EventBridge.

1. In the **Triggers** section, choose **Add trigger**.
1. Select a trigger from the list. For example, you can set an AWS CloudWatch Event. To learn more about Amazon ECR events you can schedule, see [Sample events from Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ecr-eventbridge.html#ecr-eventbridge-bus).
1. Choose **Test** to initiate the function.

## (Optional) Step 6: Add the role permission for Amazon SES

If you want to use Amazon SES for the email transport, you need to set up permissions.

1. Select **Configuration** and choose **Execution role**.
1. In **Summary**, choose **Permissions**.
1. Select **{}JSON** to open the JSON policy editor.
1. Add the permissions for the Amazon SES resource that you want to use.

The following example provides the resource ARN for the send email action:

```json
{
"Effect": "Allow",
"Action": [
      "ses:SendEmail",
      "ses:SendRawEmail"
            ],
"Resource": "arn:aws:ses:us-west-2:555555511111:identity/username@amazon.com"
}
```

To learn more about setting role permissions, see [Permissions](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-images.html#gettingstarted-images-permissions) in the AWS Lambda user guide.