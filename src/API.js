import * as FS from "fs";
import * as OS from "os";
import * as Path from "path";
import * as HTTPs from "https";
import * as Process from "process";
import * as Assertions from "assert";

const Port = 8000;
const Package = await import("./Package.js").then(
    (Module) => Module.default()
);
const Version = await import("./Version.js").then(
    (Module) => Module.default()
);

const CWD = Process.cwd();

const Evaluate = () => FS.existsSync(CWD + Path.sep + "package.json");

Assertions.ok(Evaluate(), "Assertion Failure: `package.json` Not Found");

const Index = (variable) => (variable) ? Process.env[variable] : "";

const $ = {
    pfx: FS.readFileSync(
        [Process.cwd(), ".ci", "Development.pfx"].join(
            Path.sep
        )
    ), passphrase: Index()
};

(Process.env.environment === "Production") ? Assertions.ok($.passphrase, "Passphrase Cannot be Undefined")
    : Assertions.ok($.pfx, "Context Must be Secured");

HTTPs.createServer({...$, enableTrace: true }, (request, response) => {
    response.statusMessage = "Successful";
    response.setHeader("Server", "@Nexus");
    response.setHeader("Content-Type", "Application/JSON");
    response.writeHead(200);

    response.end(JSON.stringify({
        Status: 200,
        Message: "Successful",
        Uptime: process.uptime(),
        Method: request.method,
        Hostname: OS.hostname(),
        Endpoint: request.url,
        Version: Version,
        Package: Package
    }, null, 4));

}).listen(Port).on("close", (event) => {
    console.debug(JSON.stringify(event, null, 4));
}).on("clientError", (event) => {
    console.warn(JSON.stringify(event, null, 4));
}).on("listening", () => {
    Process.stdout.write("Local API Endpoint(s):" + "\n" +
        " - https://localhost:" + String(Port)
        + "\n"
    );
});