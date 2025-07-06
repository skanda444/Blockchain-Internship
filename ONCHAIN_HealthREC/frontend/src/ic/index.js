import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../src/declarations/icp_rust_boilerplate_backend";

// ✅ Assign the canister ID from env AFTER the imports
const defaultCanisterId = import.meta.env.VITE_CANISTER_ID_ICP_RUST_BOILERPLATE_BACKEND;

console.log("🧪 Canister ID at runtime:", defaultCanisterId);
console.log("🔎 Raw ENV value:", import.meta.env.VITE_CANISTER_ID_ICP_RUST_BOILERPLATE_BACKEND);

export function createActor(canisterId = defaultCanisterId) {
  const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

  if (import.meta.env.MODE === "development") {
    agent.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Is the local replica running?");
      console.error(err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}

// Optional: default backend instance
export const backend = createActor();
