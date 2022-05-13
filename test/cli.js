//@ts-check

import tests from "./tests.js"
import {cli} from "../src/index.js"

cli(tests).then(console.log)
