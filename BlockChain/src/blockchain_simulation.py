import hashlib
import datetime

class Block:
    def __init__(self, index, timestamp, data, previousHash=''):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previousHash = previousHash
        self.nonce = 0 # Included for consistency, though not actively used for mining in this specific task
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        """Calculates the SHA-256 hash of the block's contents."""
        block_string = str(self.index) + str(self.timestamp) + str(self.data) + \
                       str(self.previousHash) + str(self.nonce)
        return hashlib.sha256(block_string.encode()).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        """Creates the first block in the blockchain."""
        return Block(0, datetime.datetime.now(), "Genesis Block", "0")

    def get_latest_block(self):
        """Returns the last block in the chain."""
        return self.chain[-1]

    def add_block(self, new_block):
        """Adds a new block to the chain, linking it to the previous block."""
        new_block.previousHash = self.get_latest_block().hash
        new_block.hash = new_block.calculate_hash() # Hash is calculated once upon creation here
        self.chain.append(new_block)

    def is_chain_valid(self):
        """Checks if the entire blockchain is valid."""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            # Check if current block's hash is correctly calculated based on its own data
            if current_block.hash != current_block.calculate_hash():
                print(f"Validation Error: Block {current_block.index}'s hash mismatch (expected {current_block.calculate_hash()}, got {current_block.hash})")
                return False

            # Check if current block correctly points to the previous block's hash
            if current_block.previousHash != previous_block.hash:
                print(f"Validation Error: Block {current_block.index}'s previous hash mismatch (expected {previous_block.hash}, got {current_block.previousHash})")
                return False
        return True

# --- Main simulation for Task 1: 3 Linked Blocks ---
if __name__ == "__main__":
    my_blockchain = Blockchain()

    print("--- Building Blockchain with 3 Blocks (Task 1) ---")

    # Add Block 1
    my_blockchain.add_block(Block(1, datetime.datetime.now(), {"amount": 10, "from": "Alice", "to": "Bob"}))
    print(f"Block 1 Hash: {my_blockchain.chain[1].hash}")

    # Add Block 2
    my_blockchain.add_block(Block(2, datetime.datetime.now(), {"amount": 5, "from": "Bob", "to": "Charlie"}))
    print(f"Block 2 Hash: {my_blockchain.chain[2].hash}")

    # Add Block 3
    my_blockchain.add_block(Block(3, datetime.datetime.now(), {"amount": 3, "from": "Charlie", "to": "Alice"}))
    print(f"Block 3 Hash: {my_blockchain.chain[3].hash}")

    print("\n--- Displaying All Blocks ---")
    for block in my_blockchain.chain:
        print(f"Index: {block.index}")
        print(f"Timestamp: {block.timestamp}")
        print(f"Data: {block.data}")
        print(f"Previous Hash: {block.previousHash}")
        print(f"Hash: {block.hash}\n")

    print("\n--- Chain Validity Check (Initial) ---")
    print(f"Is blockchain valid? {my_blockchain.is_chain_valid()}")

    print("\n--- Challenge: Tampering Block 1 ---")
    # Change data of Block 1
    my_blockchain.chain[1].data = {"amount": 10000, "from": "Alice", "to": "Bob (Tampered)"}
    print("Block 1 data tampered!")

    print("\n--- Chain Validity Check (After Tampering Block 1 without recalculating hash) ---")
    # Observe the chain becomes invalid because Block 2's previousHash now points to the OLD hash of Block 1
    # Also, Block 1's own hash (if you were to recalculate it) would not match its stored hash
    print(f"Is blockchain valid? {my_blockchain.is_chain_valid()}")

    print("\n--- Recalculating Block 1's hash after tampering ---")
    my_blockchain.chain[1].hash = my_blockchain.chain[1].calculate_hash()
    print(f"New Block 1 Hash after recalculation: {my_blockchain.chain[1].hash}")

    print("\n--- Chain Validity Check (After recalculating ONLY Block 1's hash) ---")
    # The chain is still invalid because Block 2's previousHash is still the old hash of Block 1
    print(f"Is blockchain valid? {my_blockchain.is_chain_valid()}")

    print("\n--- Recomputing Hashes of Following Blocks to Restore Validity ---")
    # To make the chain valid again, all subsequent blocks must have their previousHash and hash updated
    for i in range(2, len(my_blockchain.chain)):
        current_block = my_blockchain.chain[i]
        previous_block = my_blockchain.chain[i-1]
        current_block.previousHash = previous_block.hash
        current_block.hash = current_block.calculate_hash()
        print(f"Recomputed Block {i} Hash: {current_block.hash}")

    print("\n--- Chain Validity Check (After recomputing all subsequent hashes) ---")
    print(f"Is blockchain valid? {my_blockchain.is_chain_valid()}")