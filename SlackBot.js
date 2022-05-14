const { App } = require('@slack/bolt');

const app = new App({
    token: process.env.SLACK_TOKEN,
    appToken: process.env.SLACK_APPTOKEN,
    socketMode: true
});

app.command("/ping", async ({command, ack, say}) => {
    await ack();
    await say("Pong!");
});

(async () => {
    await app.start();
    console.log("App running!");
})();