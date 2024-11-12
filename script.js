const puzzle = document.querySelector(".puzzle");
const tiles = Array.from(document.querySelectorAll(".tile"));
let solution_length = 0; // Solution Path Length 저장 변수
let current_puzzle_state = []; // 현재 퍼즐 상태를 저장할 배열
let initial_puzzle_state = []; // 처음 섞은 상태를 저장할 배열
let result_length; // result_length를 전역 변수로 선언하여 어디서든 접근 가능

// 타일을 클릭하여 이동
// 타일을 클릭하여 이동
puzzle.addEventListener("click", (e) => {
  const tile = e.target;
  if (!tile.classList.contains("empty")) {
    const empty_tile = document.querySelector(".empty");
    const tile_index = tiles.indexOf(tile);
    const empty_index = tiles.indexOf(empty_tile);

    if (isAdjacent(tile_index, empty_index)) {
      const tile_value =
        tile.textContent === "" ? 0 : parseInt(tile.textContent);
      const empty_value =
        empty_tile.textContent === "" ? 0 : parseInt(empty_tile.textContent);

      current_puzzle_state[tile_index] = empty_value;
      current_puzzle_state[empty_index] = tile_value;

      swapTiles(tile, empty_tile);

      if (isSolved(current_puzzle_state)) {
        const successElement = document.getElementById("Success");
        successElement.classList.add("show"); // 퍼즐이 맞춰졌을 때만 체크 표시 나타나기
      }

      // 이동 횟수 텍스트 업데이트
      document.getElementById(
        "solution-output"
      ).innerText = `남은 이동 횟수: ${result_length}`; // 이곳에 업데이트된 남은 횟수를 표시
    }
  }
});

// 타일이 인접한지 확인하는 함수
function isAdjacent(index1, index2) {
  const row1 = Math.floor(index1 / 3);
  const col1 = index1 % 3;
  const row2 = Math.floor(index2 / 3);
  const col2 = index2 % 3;
  return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

// 두 타일의 위치를 교환하는 함수
function swapTiles(tile1, tile2) {
  const temp = tile1.textContent;
  tile1.textContent = tile2.textContent;
  tile2.textContent = temp;

  tile1.classList.toggle("empty");
  tile2.classList.toggle("empty");

  result_length -= 1; // 이동 후 남은 횟수 감소
  document.getElementById(
    "solution-output"
  ).innerText = `남은 이동 횟수: ${result_length}`; // 업데이트된 횟수 표시
}

const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

// 랜덤한 초기 상태를 생성하는 함수
function generateRandomPuzzle() {
  const puzzle = [...GOAL_STATE]; // GOAL_STATE에서 배열 복사
  for (let i = 0; i < puzzle.length * 2; i++) {
    const idx1 = Math.floor(Math.random() * puzzle.length);
    const idx2 = Math.floor(Math.random() * puzzle.length);

    [puzzle[idx1], puzzle[idx2]] = [puzzle[idx2], puzzle[idx1]];
  }
  return puzzle; // 랜덤하게 섞인 퍼즐 반환
}

// 퍼즐이 목표 상태인지 확인하는 함수
function isSolved(state) {
  return JSON.stringify(state) === JSON.stringify(GOAL_STATE);
}

// 현재 퍼즐 상태를 웹의 타일에 반영하는 함수
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

function resetPuzzle() {
  current_puzzle_state = [...initial_puzzle_state]; // 처음 섞은 상태로 복원
  solution_length = bfs(current_puzzle_state).length; // 초기 상태에서 경로 길이를 다시 계산
  updatePuzzleTiles(current_puzzle_state); // 타일을 초기 상태로 업데이트

  document.getElementById(
    "solution-output"
  ).innerText = `Solution Path Length: ${solution_length}`;

  const successElement = document.getElementById("Success");
  successElement.classList.remove("show"); // 'show' 클래스 제거하여 체크 표시 숨기기
}

// 퍼즐 섞기 버튼 클릭 시
document.getElementById("solve-button").addEventListener("click", () => {
  const puzzleElement = document.querySelector(".puzzle");
  puzzleElement.classList.add("puzzle-rotate");

  initial_puzzle_state = generateRandomPuzzle(); // 새로운 퍼즐 생성 및 저장
  current_puzzle_state = [...initial_puzzle_state]; // 현재 퍼즐 상태도 동일하게 설정
  updatePuzzleTiles(current_puzzle_state); // HTML 타일 상태 업데이트

  const successElement = document.getElementById("Success");
  successElement.classList.remove("show");

  setTimeout(() => {
    const solution_path = bfs(current_puzzle_state);

    if (solution_path) {
      solution_length = solution_path.length;
      document.getElementById(
        "solution-output"
      ).innerText = `Solution Path Length: ${solution_length}`;

      puzzleElement.classList.remove("puzzle-rotate");
    } else {
      document.getElementById("solution-output").innerText =
        "해결 불가! 다시 섞어주세요.";

      puzzleElement.classList.add("shake", "error-border");

      setTimeout(() => {
        puzzleElement.classList.remove("shake", "error-border");
      }, 1000);

      puzzleElement.classList.remove("puzzle-rotate");
    }
  }, 100);
});

// 초기화 버튼 추가
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("reset-button").addEventListener("click", () => {
    resetPuzzle();
  });
});

function bfs(start_state) {
  console.log("초기 상태 퍼즐:", start_state); // 초기 상태 출력

  // 출력 영역 선택
  const stepOutput = document.getElementById("step-output");
  stepOutput.innerHTML = "";

  if (isSolved(start_state)) {
    return [];
  }

  const queue = [[start_state, []]];
  const visited = new Set();

  while (queue.length > 0) {
    const [current_state, path] = queue.shift();
    const state_key = current_state.toString();

    if (visited.has(state_key)) {
      continue;
    }

    visited.add(state_key);

    for (let next_state of getNewStates(current_state)) {
      const next_state_key = next_state.toString();
      if (visited.has(next_state_key)) {
        continue;
      }

      if (isSolved(next_state)) {
        const final_path = [...path, next_state];
        console.log("해결된 경로에서 각 상태의 0의 인덱스 위치:");

        // 각 상태의 0 위치를 웹 페이지에 출력
        final_path.forEach((state, index) => {
          const stepInfo = `Step ${index + 1}: 0의 위치는 ${
            state.indexOf(0) + 1
          } 입니다.`;
          const stepElement = document.createElement("p");
          stepElement.textContent = stepInfo;
          stepOutput.appendChild(stepElement);
        });
        return final_path;
      }

      queue.push([next_state, [...path, next_state]]);
    }
  }

  return null; // 해결 불가능한 경우
}

// 빈 칸(0)의 위치를 찾아 이동 가능한 상태들을 반환하는 함수
function getNewStates(state) {
  const zero_idx = state.indexOf(0);
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

// Easy 모드
document.getElementById("easy-button").addEventListener("click", () => {
  result_length = Infinity; // 무한으로 설정
  document.getElementById("solution-output").innerText = `남은 이동 횟수: ∞`; // 이지 모드에서 이동 횟수 표시
  document.getElementById("step-output").style.display = "block"; // Easy 모드에서만 step-output 보이기
  document.getElementById("hidden").style.display = "block"; // 히든 버튼 보이기
});

// Normal 모드
document.getElementById("normal-button").addEventListener("click", () => {
  // 현재 상태에서 경로 길이의 최솟값 계산 후 20 더해 설정
  result_length = solution_length + 20; // 최솟값에 20 더하기
  document.getElementById(
    "solution-output"
  ).innerText = `Solution Path Length: ${result_length}`; // 노말 모드에서는 기존 텍스트 사용
  document.getElementById("step-output").style.display = "none"; // 노말 모드에서도 step-output 숨기기
  document.getElementById("hidden").style.display = "none"; // 히든 버튼 숨기기
});

// Hard 모드
document.getElementById("very-hard-button").addEventListener("click", () => {
  // 하드 모드는 solution_length를 유지
  result_length = solution_length; // 현재 상태 유지
  document.getElementById(
    "solution-output"
  ).innerText = `Solution Path Length: ${result_length}`; // 하드 모드에서도 기존 텍스트 사용
  document.getElementById("step-output").style.display = "none"; // 하드 모드에서도 step-output 숨기기
  document.getElementById("hidden").style.display = "none"; // 히든 버튼 숨기기
});

// hidden 버튼 클릭 이벤트 설정
document.getElementById("hidden").addEventListener("click", () => {
  const stepOutput = document.getElementById("step-output");
  // step-output의 display 상태를 토글
  if (stepOutput.style.display === "none" || stepOutput.style.display === "") {
    stepOutput.style.display = "block"; // 보이게 설정
  } else {
    stepOutput.style.display = "none"; // 숨기기
  }
});
