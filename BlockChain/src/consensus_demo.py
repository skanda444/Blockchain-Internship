import random

def simulate_pow(miners):
    """
    Simulates Proof-of-Work: selects the miner with the highest 'power'.
    """
    print("\n--- Simulating Proof-of-Work (PoW) ---")
    print("Logic: In PoW, the validator with the highest 'computational power' (hash rate) is most likely to find the next block.")

    # Find the miner with the maximum power
    selected_miner = max(miners, key=lambda miner: miner['power'])

    print(f"Selected PoW Validator: Miner with power {selected_miner['power']} (ID: {selected_miner['id']})")
    print(f"Explanation: Miner {selected_miner['id']} had the highest simulated computational power, making them the 'winner' in this round.")

def simulate_pos(stakers):
    """
    Simulates Proof-of-Stake: selects the staker with the highest 'stake'.
    """
    print("\n--- Simulating Proof-of-Stake (PoS) ---")
    print("Logic: In PoS, the validator with the highest 'stake' (amount of cryptocurrency held and pledged) has a higher chance of being selected to create the next block.")

    # Find the staker with the maximum stake
    selected_staker = max(stakers, key=lambda staker: staker['stake'])

    print(f"Selected PoS Validator: Staker with stake {selected_staker['stake']} (ID: {selected_staker['id']})")
    print(f"Explanation: Staker {selected_staker['id']} held the largest simulated stake, giving them the highest probability of being chosen.")

def simulate_dpos(delegates, voters):
    """
    Simulates Delegated Proof-of-Stake: selects a delegate based on votes.
    """
    print("\n--- Simulating Delegated Proof-of-Stake (DPoS) ---")
    print("Logic: In DPoS, token holders 'vote' for delegates to validate transactions. The delegate with the most votes is chosen, or chosen proportionally.")
    print("For simplicity, we'll pick a delegate based on their vote count; a higher vote count means a higher 'chance' of being selected, or directly chosen if it's the max.")

    # Tally votes for each delegate
    delegate_votes = {delegate['id']: 0 for delegate in delegates}
    for voter in voters:
        # Each voter votes for one random delegate
        chosen_delegate_id = random.choice([d['id'] for d in delegates])
        delegate_votes[chosen_delegate_id] += voter['votes'] # Voter's 'votes' attribute defines their voting power

    print("Delegate Vote Counts:")
    for delegate_id, votes in delegate_votes.items():
        print(f"  Delegate {delegate_id}: {votes} votes")

    # Select the delegate with the highest votes
    selected_delegate_id = max(delegate_votes, key=delegate_votes.get)
    selected_delegate = next(d for d in delegates if d['id'] == selected_delegate_id)


    print(f"Selected DPoS Validator: Delegate {selected_delegate['id']} with {delegate_votes[selected_delegate_id]} total votes")
    print(f"Explanation: Delegate {selected_delegate['id']} received the most votes from the simulated voters, making them the chosen validator for this round.")


# --- Main simulation ---
if __name__ == "__main__":
    # Mock objects for PoW
    miners = [
        {"id": "Miner A", "power": random.randint(10, 100)},
        {"id": "Miner B", "power": random.randint(10, 100)},
        {"id": "Miner C", "power": random.randint(10, 100)},
    ]
    print("Simulating PoW with Miners:", miners)
    simulate_pow(miners)

    # Mock objects for PoS
    stakers = [
        {"id": "Staker X", "stake": random.randint(50, 500)},
        {"id": "Staker Y", "stake": random.randint(50, 500)},
        {"id": "Staker Z", "stake": random.randint(50, 500)},
    ]
    print("\nSimulating PoS with Stakers:", stakers)
    simulate_pos(stakers)

    # Mock objects for DPoS
    delegates = [
        {"id": "Delegate P"},
        {"id": "Delegate Q"},
        {"id": "Delegate R"},
    ]
    # Voters with random voting power
    voters = [
        {"id": "Voter 1", "votes": random.randint(1, 10)},
        {"id": "Voter 2", "votes": random.randint(1, 10)},
        {"id": "Voter 3", "votes": random.randint(1, 10)},
        {"id": "Voter 4", "votes": random.randint(1, 10)}, # Added another voter for more dynamic voting
    ]
    print("\nSimulating DPoS with Delegates:", delegates, "and Voters:", voters)
    simulate_dpos(delegates, voters)