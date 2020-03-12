const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
// const github = require("@actions/github");
const { Octokit } = require("@octokit/core");

const query = `{
  viewer {
    login
    repositories(orderBy: {field: STARGAZERS, direction: DESC}, first: 25, privacy: PUBLIC) {
      nodes {
        name
        stargazers {
          totalCount
        }
      }
    }
  }
}`;

main();

async function main() {
  try {
    const octokit = new Octokit({ auth: core.getInput("USER_TOKEN") });
    const nameToGreet = core.getInput("who-to-greet");
    console.log(`Hello ${nameToGreet}!`);
    const time = new Date().toTimeString();
    core.setOutput("time", time);

    const data = await octokit.graphql(query);
    console.log("x is ", data);
    console.log("x is ", JSON.stringify(data));
    const repoStars = data.viewer.repositories.nodes.map(repo => ({
      name: repo.name,
      stars: repo.stargazers.totalCount
    }));
    console.log(`response:`, JSON.stringify(repoStars, null, 2));
    writeData(repoStars);

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

function writeData(repoStars) {
  console.log("ws path", process.env.GITHUB_WORKSPACE);
  const isoDate = new Date().toISOString();
  const month = isoDate.slice(0, 7);
  const filename = month + ".csv";
  const stream = fs.createWriteStream(
    path.join(process.env.GITHUB_WORKSPACE, "data", filename),
    { flags: "a" }
  );

  repoStars.forEach(({ name, stars }) => {
    stream.write(`${isoDate},${name},${stars}\n`);
  });

  console.log(new Date().toISOString());
  stream.end();
}
