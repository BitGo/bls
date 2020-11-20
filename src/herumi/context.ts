/* eslint-disable require-atomic-updates */
import bls from "@chainsafe/eth2-bls-wasm";

type Bls = typeof bls;
let blsGlobal: Bls | null = null;
let blsGlobalPromise: Promise<void> | null = null;

export async function setupBls(): Promise<void> {
  if (!blsGlobal) {
    await bls.init();
    blsGlobal = bls;
  }
}

// Cache a promise for Bls instead of Bls to make sure it is initialized only once
export async function initBLS(): Promise<void> {
  if (!blsGlobalPromise) {
    blsGlobalPromise = setupBls();
  }
  return blsGlobalPromise;
}

export function destroy(): void {
  blsGlobal = null;
  blsGlobalPromise = null;
}

export function getContext(): Bls {
  if (!blsGlobal) {
    throw new Error("BLS not initialized");
  }
  return blsGlobal;
}
