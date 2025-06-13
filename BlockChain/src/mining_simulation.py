import hashlib
import datetime
import time # Import time module for measuring execution time

class Block:
    def __init__(self, index, timestamp, data, previousHash=''):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previousHash = previousHash
        self.nonce = 0 # Nonce is crucial for mining
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        """Calculates the SHA-256 hash of the block's contents."""
        block_string = str(self.index) + str(self.timestamp) + str(self.data) + \
                       str(self.previousHash) + str(self.nonce)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mineBlock(self, difficulty):
        """
        Mines the block by finding a hash that meets the difficulty requirement.
        Difficulty is defined by the number of leading zeros required.
        """
        print(f"Mining block {self.index}...")
        start_time = time.time() # Start timer

        # Loop until the hash starts with '0' repeated 'difficulty' times
        target_prefix = "0" * difficulty
        while not self.hash.startswith(target_prefix):
            self.nonce += 1
            self.hash = self.calculate_hash()

        end_time = time.time() # End timer
        time_taken = end_time - start_time

        print(f"Block {self.index} mined: {self.hash}")
        print(f"Nonce attempts needed: {self.nonce}")
        print(f"Time taken: {time_taken:.4f} seconds\n")


class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.difficulty = 2 # Initial difficulty set to 2 leading zeros for demonstration

    def create_genesis_block(self):
        """Creates the first block in the blockchain."""
        # Genesis block doesn't need mining in this simple simulation
        return Block(0, datetime.datetime.now(), "Genesis Block", "0")

    def get_latest_block(self):
        """Returns the last block in the chain."""
        return self.chain[-1]

    def add_block(self, new_block):
        """Adds a new block to the chain after mining it."""
        new_block.previousHash = self.get_latest_block().hash
        # Mine the new block before adding it to the chain
        new_block.mineBlock(self.difficulty)
        self.chain.append(new_block)

    def is_chain_valid(self):
        """Checks if the entire blockchain is valid according to mining rules."""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            # Re-check if current block's hash is correctly calculated (and meets difficulty)
            target_prefix = "0" * self.difficulty
            if current_block.hash != current_block.calculate_hash() or \
               not current_block.hash.startswith(target_prefix):
                print(f"Validation Error: Block {current_block.index}'s hash mismatch or difficulty requirement not met.")
                return False

            # Check if current block correctly points to the previous block's hash
            if current_block.previousHash != previous_block.hash:
                print(f"Validation Error: Block {current_block.index}'s previous hash mismatch.")
                return False
        return True

# --- Main simulation for Task 2: Nonce Mining ---
if __name__ == "__main__":
    my_blockchain = Blockchain()
    print(f"--- Mining Blockchain with Difficulty {my_blockchain.difficulty} (Task 2) ---")

    # Add Block 1 (will be mined)
    my_blockchain.add_block(Block(1, datetime.datetime.now(), {"amount": 10, "from": "Alice", "to": "Bob"}))

    # Add Block 2 (will be mined)
    my_blockchain.add_block(Block(2, datetime.datetime.now(), {"amount": 5, "from": "Bob", "to": "Charlie"}))

    # Add Block 3 (will be mined)
    my_blockchain.add_block(Block(3, datetime.datetime.now(), {"amount": 3, "from": "Charlie", "to": "Alice"}))

    print("\n--- Displaying Mined Blocks ---")
    for block in my_blockchain.chain:
        print(f"Index: {block.index}")
        print(f"Timestamp: {block.timestamp}")
        print(f"Data: {block.data}")
        print(f"Previous Hash: {block.previousHash}")
        print(f"Nonce: {block.nonce}")
        print(f"Hash: {block.hash}\n")

    print("\n--- Chain Validity Check (After Mining) ---")
    print(f"Is blockchain valid? {my_blockchain.is_chain_valid()}")

    print("\n--- Challenge: Increasing Difficulty ---")
    print("Trying to mine a new block with difficulty 4 (more leading zeros)...")
    my_blockchain.difficulty = 4 # Increase difficulty for demonstration

    # Add another block to see the impact of higher difficulty
    my_blockchain.add_block(Block(4, datetime.datetime.now(), {"amount": 7, "from": "Dave", "to": "Eve"}))

    print("\n--- Chain Validity Check (After Mining with Higher Difficulty) ---")
    print(f"Is blockchain valid? {my_blockchain.is_chain_valid()}")