import path from "path";
import {describeDirectorySpecTest, InputType} from "@chainsafe/lodestar-spec-test-util";
import {hexToBytes} from "../../src/helpers";
import {SPEC_TESTS_DIR} from "../params";
import {describeForAllImplementations} from "../switch";

interface IAggregateSigsVerifyTestCase {
  data: {
    input: {
      pubkeys: string[];
      messages: string[];
      signature: string;
    };
    output: boolean;
  };
}

describeForAllImplementations((bls) => {
  describeDirectorySpecTest<IAggregateSigsVerifyTestCase, boolean>(
    "bls/aggregate_verify/small",
    path.join(SPEC_TESTS_DIR, "general/phase0/bls/aggregate_verify/small"),
    (testCase) => {
      const {pubkeys, messages, signature} = testCase.data.input;
      return bls.verifyMultiple(pubkeys.map(hexToBytes), messages.map(hexToBytes), hexToBytes(signature));
    },
    {
      inputTypes: {data: InputType.YAML},
      getExpected: (testCase) => testCase.data.output,
    }
  );
});
