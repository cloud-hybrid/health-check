import * as HTTPs from "https";
import * as Process from "process";

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

        Process.stdout.write(" - Public (HTTP): " + "http://" + Output + ":8000" + "\n");
        Process.stdout.write(" - Public (HTTPs): " + "https://" + Output + ":8443" + "\n");
    });
}).on("error", function(e) {
    console.error("Error: " + e.message);
});

export default IP;
