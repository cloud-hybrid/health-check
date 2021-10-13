import * as FS from "fs";
import * as Path from "path";
import * as HTTP from "http";
import * as HTTPs from "https";
import * as Process from "process";
import * as Assertions from "assert";

const Package = await import("./Package.js").then(
    (Module) => Module.default()
);

const Version = await import("./Version.js").then(
    (Module) => Module.default()
);

await import("./IP.js").then((Module) => Module.default);

const CWD = Process.cwd();

const Evaluate = () => FS.existsSync(CWD + Path.sep + "package.json");

Assertions.ok(Evaluate(), "Assertion Failure: `package.json` Not Found");

const Index = (variable) => (variable) ? Process.env[variable] : "";

const TLS = {
    pfx: FS.readFileSync(
        [Process.cwd(), ".ci", "Development.pfx"].join(
            Path.sep
        )
    ), passphrase: Index()
};

(Process.env.environment === "Production") ? Assertions.ok(TLS.passphrase, "Passphrase Cannot be Undefined")
    : Assertions.ok(TLS.pfx, "Context Must be Secured");

[HTTP, HTTPs].forEach(
    (Server, Index) => Server.createServer((Index === 1)
        ? { ... TLS, enableTrace: true } : {}, (
            request, response
    ) => {
        response.statusMessage = "Successful";

        response.setHeader("Server", "@Nexus");
        response.setHeader("Content-Type", "Application/JSON");

        response.writeHead(200);

        response.end(JSON.stringify({
            Status: 200,
            Message: "Successful",
            Uptime: Process.uptime(),
            Method: request.method,
            Server: response.socket.address(),
            Endpoint: request.url,
            Version: Version,
            Debug: (Process.env.debug) ? Package : "Disabled"
        }, null, 4));
    }).listen({
        host: "0.0.0.0",
        port: (Index === 0) ? 8080 : 8443,
        // path: "/api/internal/health-check"
    }).on("close", (event) => {
        console.debug(JSON.stringify(event, null, 4));
    }).on("clientError", (event) => {
        console.warn(JSON.stringify(event, null, 4));
    }).on("listening", () => {
        (Index === 0) ? Process.stdout.write(
            " - HTTP: http://localhost:8080" + "\n"
        ) : Process.stdout.write(
            " - HTTPs: https://localhost:8443" + "\n"
        );
    })
);