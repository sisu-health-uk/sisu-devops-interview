# SiSU DevOps Interview

This project is designed for a DevOps interview scenario. The goal is to deploy a simple application with the following architecture:

## Architecture Overview

- **Backend:** AWS Lambda function (serverless)
- **Frontend:** React application hosted on AWS S3, served via CloudFront

## Requirements

- AWS account with permissions to create Lambda, S3 buckets, and CloudFront distributions
- Node.js and npm installed locally (for React frontend)
- AWS CLI configured

## Setup Instructions

### 1. Backend (AWS Lambda)

- Write your backend logic as a Lambda function (Node.js or Python recommended).
- Deploy the Lambda using AWS Console, AWS CLI, or Infrastructure as Code (e.g., CloudFormation, Terraform).
- Expose the Lambda via API Gateway for HTTP access.

### 2. Frontend (React on S3 + CloudFront)

- Create a React app (`npx create-react-app my-app`).
- Build the app (`npm run build`).
- Upload the build output to an S3 bucket configured for static website hosting.
- Set up a CloudFront distribution pointing to the S3 bucket for global CDN delivery.

### 3. Integration

- Configure the React frontend to call the Lambda backend via the API Gateway endpoint.
- Ensure CORS is enabled on the API Gateway.

## Deliverables

- Lambda function code and deployment instructions
- React frontend code and deployment instructions
- Documentation of the deployment process (manual steps or IaC templates)
- Architecture diagram (optional)

## Notes

- Focus on automation and best practices (e.g., CI/CD, security, scalability).
- You may use any tools or frameworks you prefer for deployment.
- Make sure to clean up AWS resources after the interview.

---