const core = require("@actions/core");
// const github = require("@actions/github");
const { Octokit } = require("@octokit/action");

main();

async function main() {
  try {
    // `who-to-greet` input defined in action metadata file
    const octokit = new Octokit();
    const nameToGreet = core.getInput("who-to-greet");
    console.log(`Hello ${nameToGreet}!`);
    const time = new Date().toTimeString();
    core.setOutput("time", time);

    const data = await octokit.graphql(query, variables);
    console.log(`response:`, JSON.stringify(data, null, 2));

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}