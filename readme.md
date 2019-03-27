## How to Run
This is a simple node.js application. So all you need to do is extract the 
archive, cd into that directory, and then run `npm i && npm start`.
An example config is already included. It should be pretty self-explanatory.

## How I tested this project
I tested this project using two basic configurations in postman. I've included a few example requests that I created.
You'll need to import them into Postman for them to be human-readable. Since the project is very basic, I just started the server on my local machine,
ran the JIRA server through docker, and sent a request through postman to the project. I then simply checked to make sure that the issue was there and was in tact.

## Notes
- Even though the requirements note that there is no need to support authentication, I found that it was necessary to support
  if I wanted to test the project. Therefore, you must pass a simple Base64 encoded bearer token in your POST request.
- The configureation file has support for different endpoints, in case the JIRA server isn't running on your local machine.
- I've never used JIRA before this project, so if there's anything I'm missing, please send me an email, and I'd be happy to fix it.
- This project was tested using the latest (Non-LTS) version of Node. There shouldn't be any issues using another version,
  but if you do run into any issues, the first thing you should do is update node.
- It's entirely possible there will be issues running this on a different machine than mine, so once again, please let me know if you have any issues, and I'd be happy to fix them.

Description
-----------
Create a simple service that processes JSON data from a call center.  This service is responsible for monitoring all calls that are handled in a call center.  
If certain criteria are met, the service should use the Jira REST API to create issues in the customers Jira portal for automated follow up.  The service should 
have several configurable parameters to determine the trigger criteria.

Background Info
---------------
JIRA is a ticketing system (you may have seen or used before).  An "Issue" is simply a ticket in the JIRA system.

High Level Requirements
-----------------------
A basic service that accepts an HTTP post with a JSON payload.

Configuration for thresholds used to trigger issue creation based on:
	Time the caller spent waiting in queue "total_wait_time"
	Specific queue that the caller came through "queue_name"
	Specific caller "caller_id_name"
	Who handled the call "recipient_id" (Does it need to meet all this criteria? Or just one.)

Once issue creation is triggered, the service uses Jira REST API to create a JIRA Issue.
	The issue summary should contain information about the caller (such as caller id information) for easy identification
	Issue description should contain information about why the issue is being created, as well as queue and recipient information

Notes On Requirements
---------------------
The important parts of this assignment are accepting the JSON data, processing it, and creating the issue using the data. 
The configurations can be stored in a config file.  Supporting multiple triggers is not required, but a nice to have.
Do not worry about Jira authentication, only the API requests to create the issue's are important.
The api requests can be logged to STDOUT (you don't have to include the actual HTTP POST'ing)

Implementation Details
----------------------
You are free to choose how you implement the service, including what language you use.

JIRA API Reference
-------------
https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/

Example JSON Payload for POST to the service
--------------------------------------------
```
{
	"action":"call_event",
	"name":"call_handled",
	"data":{
		"event_timestamp":{UNIX_TIMESTAMP},
		"queue_enter_time":{UNIX_TIMESTAMP},
		"caller_id_num":"{CALLER_ID_NUM}",
		"caller_id_name":"{CALLER_ID_NAME}",
		"queue_name":"{QUEUE_NAME}",
		"queue_id":"{QUEUE_ID}",
		"session_id":"{SESSION_ID}",
		"event_name":"call_handled",
		"recipient_id":"{RECIPIENT_ID}",
		"recipient_name":"{RECIPIENT_NAME}",
		"total_wait_time":{TOTAL_WAIT_TIME_SECONDS}
	}
}
```

Deliverables
------------
All source for the service
Information on how to configure / run
Any example configs
Any test artifacts
Any notes that you would like to make known