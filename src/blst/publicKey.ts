import * as blst from "@chainsafe/blst";
import {bytesToHex, hexToBytes} from "../helpers";
import {IPublicKey} from "../interface";

export class PublicKey implements IPublicKey {
  readonly affine: blst.PublicKey;
  readonly jacobian: blst.AggregatePublicKey;

  constructor(affine: blst.PublicKey, jacobian: blst.AggregatePublicKey) {
    this.affine = affine;
    this.jacobian = jacobian;
  }

  static fromBytes(bytes: Uint8Array): PublicKey {
    const affine = blst.PublicKey.fromBytes(bytes);
    const jacobian = blst.AggregatePublicKey.fromPublicKey(affine);
    return new PublicKey(affine, jacobian);
  }

  static fromHex(hex: string): PublicKey {
    return this.fromBytes(hexToBytes(hex));
  }

  static aggregate(pubkeys: PublicKey[]): PublicKey {
    const jacobian = blst.aggregatePubkeys(pubkeys.map((pk) => pk.jacobian));
    const affine = jacobian.toPublicKey();
    return new PublicKey(affine, jacobian);
  }

  toBytes(): Uint8Array {
    return this.affine.toBytes();
  }

  toHex(): string {
    return bytesToHex(this.toBytes());
  }
}
