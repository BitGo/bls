import path from "path";
import bls, {initBLS} from "../../src";
import {describeDirectorySpecTest, InputType} from "@chainsafe/lodestar-spec-test-util";

interface IVerifyTestCase {
  data: {
    input: {
      pubkey: string;
      message: string;
      signature: string;
    };
    output: boolean;
  };
}

before(async function f() {
  await initBLS();
});

describeDirectorySpecTest<IVerifyTestCase, boolean>(
  "BLS - verify",
  path.join(
    __dirname,
    "../../node_modules/@chainsafe/eth2-spec-tests/tests/general/phase0/bls/verify/small"
  ),
  (testCase => {
    return bls.verify(
      Buffer.from(testCase.data.input.pubkey.replace("0x", ""), "hex"),
      Buffer.from(testCase.data.input.message.replace("0x", ""), "hex"),
      Buffer.from(testCase.data.input.signature.replace("0x", ""), "hex")
    );
  }),
  {
    inputTypes: {
      data: InputType.YAML,
    },
    getExpected: (testCase => testCase.data.output)
  }
);
