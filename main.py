from flask import Flask, jsonify
import random
from collections import deque

app = Flask(__name__)

# 1. 퍼즐의 목표 상태
GOAL_STATE = (1, 2, 3, 4, 5, 6, 7, 8, 0)

# 2. 빈 칸의 이동 가능 방향 (상, 하, 좌, 우)
MOVES = {
    0: [1, 3],       # 빈칸이 0번 인덱스에 있을 때 -> 우, 하
    1: [0, 2, 4],    # 빈칸이 1번 인덱스에 있을 때 -> 좌, 우, 하
    2: [1, 5],       # 빈칸이 2번 인덱스에 있을 때 -> 좌, 하
    3: [0, 4, 6],    # 빈칸이 3번 인덱스에 있을 때 -> 상, 우, 하
    4: [1, 3, 5, 7], # 빈칸이 4번 인덱스에 있을 때 -> 좌, 우, 상, 하
    5: [2, 4, 8],    # 빈칸이 5번 인덱스에 있을 때 -> 좌, 상, 하
    6: [3, 7],       # 빈칸이 6번 인덱스에 있을 때 -> 상, 우
    7: [4, 6, 8],    # 빈칸이 7번 인덱스에 있을 때 -> 좌, 우, 상
    8: [5, 7]        # 빈칸이 8번 인덱스에 있을 때 -> 좌, 상
}

# 3. 랜덤한 초기 상태 생성 함수
def generate_random_puzzle():
    puzzle = list(GOAL_STATE)
    random.shuffle(puzzle)
    return tuple(puzzle)

# 4. 퍼즐 상태 출력 함수
def print_puzzle(puzzle):
    for i in range(0, 9, 3):
        print(puzzle[i:i+3])
    print()

# 5. 퍼즐이 목표 상태인지 확인하는 함수
def is_goal(state):
    return state == GOAL_STATE

# 6. 빈칸(0)의 위치를 찾아 이동 가능한 상태들을 반환하는 함수
def get_new_states(state):
    zero_idx = state.index(0)  # 빈칸의 위치
    new_states = []

    for move in MOVES[zero_idx]:
        new_state = list(state)
        new_state[zero_idx], new_state[move] = new_state[move], new_state[zero_idx]
        new_states.append(tuple(new_state))
    
    return new_states

# 7. BFS 탐색 함수
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

    return None  # 해결 불가능한 경우

# 8. 해결 경로 출력 함수
def print_solution_path(path):
    if path:
        print("Solution found in", len(path), "moves:")
        for state in path:
            print_puzzle(state)
    else:
        print("No solution found.")


# 실행 코드
# 실행 코드
if __name__ == "__main__":
    solution_path = None  # 처음에는 해결 경로를 None으로 설정

    # 해결 가능한 퍼즐이 나올 때까지 반복
    while solution_path is None:
        initial_puzzle = generate_random_puzzle()  # 새로운 퍼즐 생성
        print("Initial puzzle:")
        print_puzzle(initial_puzzle)

        solution_path = bfs(initial_puzzle)  # BFS 실행

    # 해결 가능한 퍼즐이 생성되면 경로 출력
    print_solution_path(solution_path)

