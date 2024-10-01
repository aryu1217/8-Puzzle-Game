import random
from collections import deque

GOAL_STATE = (1, 2, 3, 4, 5, 6, 7, 8, 0)

MOVES = {
    0: [1, 3], 1: [0, 2, 4], 2: [1, 5], 3: [0, 4, 6], 
    4: [1, 3, 5, 7], 5: [2, 4, 8], 6: [3, 7], 7: [4, 6, 8], 8: [5, 7]
}

def generate_random_puzzle():
    puzzle = list(GOAL_STATE)
    random.shuffle(puzzle)
    return tuple(puzzle)

def is_goal(state):
    return state == GOAL_STATE

def get_new_states(state):
    zero_idx = state.index(0)
    new_states = []
    for move in MOVES[zero_idx]:
        new_state = list(state)
        new_state[zero_idx], new_state[move] = new_state[move], new_state[zero_idx]
        new_states.append(tuple(new_state))
    return new_states

def bfs(start_state):
    if is_goal(start_state):
        return []
    queue = deque([(start_state, [])])
    visited = set()
    while queue:
        current_state, path = queue.popleft()
        if current_state in visited:
            continue
        visited.add(current_state)
        for next_state in get_new_states(current_state):
            if next_state in visited:
                continue
            if is_goal(next_state):
                return path + [next_state]
            queue.append((next_state, path + [next_state]))
    return None

if __name__ == "__main__":
    solution_path = None
    while solution_path is None:
        initial_puzzle = generate_random_puzzle()
        solution_path = bfs(initial_puzzle)
    if solution_path:
        print(len(solution_path))  # len(path) 값을 출력
