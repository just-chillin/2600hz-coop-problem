// Load dependencies
const fetch = require("node-fetch");
const express = require("express");
const server = express();

// Load Configuration File
const config = require("./service_config");
const trigger = config.trigger;
const api_settings = config.settings;

// Use the json-parser middleware
server.use(express.json());
server.post("/*", (req, res) => { // Set up the server to recieve post calls
    
    // Log the request to stdout
    console.log("API Request recieved.");
    console.log("Here's a dump of the json object:");
    console.log(req.body);

    let reasons = [];
    // Check against the triggers, if any match, log that reason into an array.
    if (req.body.data.total_wait_time >= trigger.total_wait_time) {
        reasons.push("The caller waited longer than the trigger time");
    }
    if (req.body.data.queue_name === trigger.queue_name) {
        reasons.push(`The caller was in queue ${trigger.queue_name}`);
    }
    if (req.body.data.caller_id_name === trigger.caller_id_name) {
        reasons.push(`The caller id name showed up as ${trigger.caller_id_name}`);
    }
    if (req.body.data.recipient_name === trigger.recipient_name) {
        reasons.push(`The call was handled by ${trigger.recipient_name}`);
    }

    // If there are any reasons to send the issue to the JIRA API, then do it.
    if (reasons.length !== 0) {
        const request = {
            "fields": {
                "project": {
                    "key": api_settings.project_key
                },
                // Caller info
                "summary": `(${req.body.data.caller_id_name}) ${req.body.data.caller_id_num}`,
                "description": `Created because: [${reasons.join('; ')}]`,
                "issuetype": {
                    "name": "Task"
                }
            }
        };

        // Send the request
        fetch(`http://${api_settings.jira_hostname}:${api_settings.jira_port}/rest/api/2/issue/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": req.headers.authorization
            },
            method: "POST",
            port: api_settings.jira_port,
            body: JSON.stringify(request)
        })
            .then(res => res.json())
            .then(json => console.log(json));
    }
    res.send("Message recieved! :)");
});
server.listen(api_settings.local_port);