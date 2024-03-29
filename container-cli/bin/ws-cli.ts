#!/usr/bin/env ts-node

import { exit } from "process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

(async () => {
  try {
    await yargs(hideBin(process.argv))
      .scriptName("ws")
      .commandDir("../commands/ws", { extensions: ["ts"], recurse: true })
      .parse();
  } catch (e) {
    console.error(e);
    exit(1);
  }
})();
