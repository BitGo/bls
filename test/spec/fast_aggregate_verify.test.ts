import path from "path";
import {describeDirectorySpecTest, InputType} from "@chainsafe/lodestar-spec-test-util";
import {hexToBytes} from "../../src/helpers";
import {SPEC_TESTS_DIR} from "../params";
import {describeForAllImplementations} from "../switch";

interface IAggregateSigsVerifyTestCase {
  data: {
    input: {
      pubkeys: string[];
      message: string;
      signature: string;
    };
    output: boolean;
  };
}

describeForAllImplementations((bls) => {
  describeDirectorySpecTest<IAggregateSigsVerifyTestCase, boolean>(
    "bls/fast_aggregate_verify/small",
    path.join(SPEC_TESTS_DIR, "tests/general/phase0/bls/fast_aggregate_verify/small"),
    (testCase) => {
      const {pubkeys, message, signature} = testCase.data.input;
      return bls.verifyAggregate(pubkeys.map(hexToBytes), hexToBytes(message), hexToBytes(signature));
    },
    {
      inputTypes: {data: InputType.YAML},
      getExpected: (testCase) => testCase.data.output,
    }
  );
});
