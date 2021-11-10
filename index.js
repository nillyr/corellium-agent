const { Corellium } = require("@corellium/corellium-api");
require("dotenv").config();

async function iter_instances_and_shutdown(project) {
    (await project.instances()).map(async (instance) => {
        if (instance.state != "off") {
            console.log("[i] Device \"" + instance.name + "\" is not in storred mode (state: " + instance.state + ")");
            console.log("[*] Shutting down...");
            await instance.stop();
        }
    });
    return;
}

async function main() {
    let corellium = new Corellium({
        endpoint: process.env.CORELLIUM_ENDPOINT,
        username: process.env.CORELLIUM_AGENT_USERNAME,
        password: process.env.CORELLIUM_AGENT_PASSWORD,
    });
    console.log("[*] Connection...");
    await corellium.login();
    console.log("[+] Connected");
    console.log("[*] Searching for active instances...");
    (await corellium.projects()).map(project => iter_instances_and_shutdown(project));
    return;
}

main().catch((err) => {
    console.error(err);
}).finally(() => { console.log("[+] Done"); });
