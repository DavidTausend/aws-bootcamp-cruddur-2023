require 'aws-sdk-s3'
require 'json'
require 'jwt'

def handler(event:, context:)
  puts event
  #return cors headers for preflight check
  if event['routeKey'] == "OPTIONS /{PROXY+}"
    puts ({step:'preflight', message: 'preflight CORS check'}.to_json)
    {
      headers: {
        "Access-Control-Allow-Headers": "*, Authorization",
        "Access-Control-Allow-Origin": "https://3000-davidtausen-awsbootcamp-z5jbe015wb7.ws-eu95.gitpod.io",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
      },
      statusCode: 200
    }
  else
    token = event['headers']['authorization'].split(' ')[1] 
    puts access_token
    puts ({step:'presignedurl', access_token: token}.to_json

    decoded_token = JWT.decode token, nil, false
    puts "decoded token"
    puts decoded_token.inspect

    s3 = Aws::S3::Resource.new
    bucket_name = ENV["UPLOADS_BUCKET_NAME"]
    object_key = 'mock.jpg'

    obj = s3.bucket(bucket_name).object(object_key)
    url = obj.presigned_url(:put, expires_in: 60 * 5)
    url # this is the data that will be returned
    body = {url: url}.to_json
    { 
      headers: {
        "Access-Control-Allow-Headers": "*, Authorization",
        "Access-Control-Allow-Origin": "https://3000-davidtausen-awsbootcamp-z5jbe015wb7.ws-eu95.gitpod.io",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
      },
      statusCode: 200
    }
  end
end