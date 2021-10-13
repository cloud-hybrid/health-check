import * as FS from "fs";
import * as Path from "path";
import * as Process from "process";
import * as Assertions from "assert";

const CWD = Process.cwd();

const Evaluate = () => FS.existsSync(CWD + Path.sep + "package.json");

Assertions.ok(Evaluate(), "Assertion Failure: `package.json` Not Found");

const Information = () => {
    const Target = CWD + Path.sep + "package.json";

    const FD = FS.openSync(Target, "r", 0o666);

    const Contents = FS.readFileSync(FD, {encoding: "UTF-8"}).toString();

    return JSON.parse(Contents);
};

export default Information;