import path from "path";
import { generate } from "openapi-typescript-validator";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

interface Arguments {
  openapi: string;
  output: string;
  type: "json" | "yaml";
}

function init() {
  yargs(hideBin(process.argv))
    .scriptName("generate-openapi-server-types")
    .command<Arguments>(
      "$0 <openapi> <output> <type>",
      "Generate a typescript server from an OpenAPI spec",
      (yargs) => {
        yargs
          .positional("openapi", {
            describe: "Path to the OpenAPI spec",
            type: "string",
          })
          .positional("output", {
            describe: "Path to the output directory",
            type: "string",
          })
          .positional("type", {
            describe: "Type of openapi spec",
            type: "string",
            choices: ["json", "yaml"],
          });
      },
      async (argv) => {
        const openapi = path.resolve(argv.openapi);
        const output = path.resolve(argv.output);
        generate({
          schemaFile: openapi,
          directory: output,
          schemaType: argv.type,
        });
      }
    )
    .help()
    .parse();
}

init();
