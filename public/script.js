// 타일 클릭하여 움직이는 로직
const puzzle = document.querySelector(".puzzle");
const tiles = Array.from(document.querySelectorAll(".tile"));
let solution_length = 0; // Solution Path Length 저장 변수
let current_puzzle_state = []; // 현재 퍼즐 상태를 저장할 배열

puzzle.addEventListener("click", (e) => {
  const tile = e.target;
  if (!tile.classList.contains("empty")) {
    const empty_tile = document.querySelector(".empty");
    const tile_index = tiles.indexOf(tile);
    const empty_index = tiles.indexOf(empty_tile);

    // 인접한 타일인지 확인 (상하좌우 인접)
    if (isAdjacent(tile_index, empty_index)) {
      // 타일과 빈칸의 위치를 교환
      swapTiles(tile, empty_tile);

      // Solution Path Length 값을 1씩 줄이기
      if (solution_length > 0) {
        solution_length -= 1;
        document.getElementById(
          "solution-output"
        ).innerText = `Solution Path Length: ${solution_length}`;
      }
    }
  }
});

/**
 * 타일이 인접했는지 확인하는 함수
 * @param {number} index1 - 첫 번째 타일의 인덱스
 * @param {number} index2 - 두 번째 타일의 인덱스
 * @returns {boolean} - 인접한 타일인지 여부
 */
function isAdjacent(index1, index2) {
  const row1 = Math.floor(index1 / 3);
  const col1 = index1 % 3;
  const row2 = Math.floor(index2 / 3);
  const col2 = index2 % 3;

  return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

/**
 * 두 타일의 위치를 교환하는 함수
 * @param {HTMLElement} tile1 - 첫 번째 타일
 * @param {HTMLElement} tile2 - 두 번째 타일 (빈칸)
 */
function swapTiles(tile1, tile2) {
  const temp = tile1.textContent;
  tile1.textContent = tile2.textContent;
  tile2.textContent = temp;

  tile1.classList.toggle("empty");
  tile2.classList.toggle("empty");
}

// 목표 상태
const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

// 빈 칸의 이동 가능 방향 (상, 하, 좌, 우)
const MOVES = {
  0: [1, 3],
  1: [0, 2, 4],
  2: [1, 5],
  3: [0, 4, 6],
  4: [1, 3, 5, 7],
  5: [2, 4, 8],
  6: [3, 7],
  7: [4, 6, 8],
  8: [5, 7],
};

/**
 * 랜덤한 초기 상태를 생성하는 함수
 * @returns {Array<number>} - 랜덤하게 섞인 퍼즐 상태 배열
 */
function generateRandomPuzzle() {
  const puzzle = [...GOAL_STATE];
  for (let i = puzzle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
  }
  return puzzle;
}

/**
 * 퍼즐이 목표 상태인지 확인하는 함수
 * @param {Array<number>} state - 현재 퍼즐 상태
 * @returns {boolean} - 목표 상태와 일치하는지 여부
 */
function isGoal(state) {
  return JSON.stringify(state) === JSON.stringify(GOAL_STATE);
}

/**
 * 빈 칸의 위치를 찾아 이동 가능한 상태들을 반환하는 함수
 * @param {Array<number>} state - 현재 퍼즐 상태
 * @returns {Array<Array<number>>} - 이동 가능한 새로운 퍼즐 상태 배열
 */
function getNewStates(state) {
  const zero_idx = state.indexOf(0); // 빈칸의 위치
  const new_states = [];

  for (let move of MOVES[zero_idx]) {
    const new_state = [...state];
    [new_state[zero_idx], new_state[move]] = [
      new_state[move],
      new_state[zero_idx],
    ];
    new_states.push(new_state);
  }

  return new_states;
}

/**
 * BFS 탐색을 사용하여 퍼즐을 해결하는 함수
 * @param {Array<number>} start_state - 시작 퍼즐 상태
 * @returns {Array<Array<number>> | null} - 퍼즐을 해결한 경로 또는 null
 */
function bfs(start_state) {
  if (isGoal(start_state)) {
    return [];
  }

  const queue = [[start_state, []]];
  const visited = new Set();

  while (queue.length > 0) {
    const [current_state, path] = queue.shift();
    const state_key = current_state.toString(); // 배열을 문자열로 변환해 Set에 저장

    if (visited.has(state_key)) {
      continue;
    }

    visited.add(state_key);

    for (let next_state of getNewStates(current_state)) {
      const next_state_key = next_state.toString();
      if (visited.has(next_state_key)) {
        continue;
      }

      if (isGoal(next_state)) {
        return [...path, next_state];
      }

      queue.push([next_state, [...path, next_state]]);
    }
  }

  return null; // 해결 불가능한 경우
}

/**
 * 해결 경로를 출력하는 함수
 * @param {Array<Array<number>>} path - 퍼즐 해결 경로
 */
function printSolutionPath(path) {
  if (path) {
    console.log("Solution found in", path.length, "moves:");
    path.forEach((state) => console.log(state));
  } else {
    console.log("No solution found.");
  }
}

/**
 * 현재 퍼즐 상태를 웹의 타일에 반영하는 함수
 * @param {Array<number>} puzzle_state - 퍼즐 상태 배열
 */
function updatePuzzleTiles(puzzle_state) {
  tiles.forEach((tile, index) => {
    const value = puzzle_state[index];
    if (value === 0) {
      tile.textContent = ""; // 빈 칸
      tile.classList.add("empty");
    } else {
      tile.textContent = value;
      tile.classList.remove("empty");
    }
  });
}

// Solve Puzzle 버튼 클릭 시
document.getElementById("solve-button").addEventListener("click", () => {
  current_puzzle_state = generateRandomPuzzle(); // 새로운 퍼즐 생성
  console.log("Initial puzzle:", current_puzzle_state);

  updatePuzzleTiles(current_puzzle_state); // HTML 타일 상태 업데이트

  const solution_path = bfs(current_puzzle_state); // BFS 실행
  printSolutionPath(solution_path);

  // 경로가 존재할 경우 경로 길이를 화면에 출력
  if (solution_path) {
    solution_length = solution_path.length;
    document.getElementById(
      "solution-output"
    ).innerText = `Solution Path Length: ${solution_length}`;
  } else {
    document.getElementById("solution-output").innerText = "No solution found.";
  }
});
