import * as HTTPs from "https";

const $ = {
    host: "ipv4bot.whatismyipaddress.com",
    port: 443,
    path: "/"
};

const IP = HTTPs.get($, (response) => {
    response.on("data", async (chunk) => {
        let Allocation = 0;

        // Allocate an Array Buffer of (n + 1) Bytes
        const Buffer = await chunk;
        new Array(Buffer[Symbol.iterator]).forEach(
            (_) => Allocation += 1
        );

        const Output = Buffer.toString("UTF-8", Allocation - 1);

        console.debug(" - IP" + ":", Output);
    });
}).on("error", function(e) {
    console.error("Error: " + e.message);
});

export default IP;
