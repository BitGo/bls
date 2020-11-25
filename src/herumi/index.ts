import {Keypair} from "./keypair";
import {PrivateKey} from "./privateKey";
import {PublicKey} from "./publicKey";
import {Signature} from "./signature";
import {initBLS, destroy} from "./context";
import {IBls} from "../interface";
import {functionalInterfaceFactory} from "../functional";

export {Keypair, PrivateKey, PublicKey, Signature, initBLS, destroy};

const bls: IBls = {
  // Keypair,
  PrivateKey,
  PublicKey,
  Signature,

  ...functionalInterfaceFactory({PrivateKey, PublicKey, Signature}),
  initBLS,
  destroy,
};

export default bls;
