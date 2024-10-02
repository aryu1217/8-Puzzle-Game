// 타일 클릭하여 움직이는 로직
const puzzle = document.querySelector(".puzzle");
const tiles = Array.from(document.querySelectorAll(".tile"));
let solution_length = 0; // Solution Path Length 저장 변수
let current_puzzle_state = []; // 현재 퍼즐 상태를 저장할 배열
let initial_puzzle_state = []; // 처음 섞은 상태를 저장할 배열

// 타일을 클릭하여 이동
puzzle.addEventListener("click", (e) => {
  const tile = e.target;
  if (!tile.classList.contains("empty")) {
    const empty_tile = document.querySelector(".empty");
    const tile_index = tiles.indexOf(tile);
    const empty_index = tiles.indexOf(empty_tile);

    // 인접한 타일인지 확인 (상하좌우 인접)
    if (isAdjacent(tile_index, empty_index)) {
      // 두 타일의 값을 교환하기 전에 현재 텍스트 값을 가져온다.
      const tile_value =
        tile.textContent === "" ? 0 : parseInt(tile.textContent);
      const empty_value =
        empty_tile.textContent === "" ? 0 : parseInt(empty_tile.textContent);

      // 두 타일의 값을 배열에 업데이트
      current_puzzle_state[tile_index] = empty_value; // 빈칸을 숫자 위치로
      current_puzzle_state[empty_index] = tile_value; // 숫자를 빈칸으로

      // 두 타일의 위치를 화면에서 교환
      swapTiles(tile, empty_tile);

      // 퍼즐 상태 출력 (디버깅용)
      console.log("현재 퍼즐 상태:", current_puzzle_state);

      // 퍼즐이 목표 상태인지 확인
      if (isSolved(current_puzzle_state)) {
        document.getElementById("Success").innerText = "Solved!";
      }

      // 남은 이동 횟수가 0이면 퍼즐을 초기 상태로 복원
      if (solution_length === -1) {
        alert("이동 횟수가 남아 있지 않습니다. 퍼즐을 초기화합니다.");
        resetPuzzle();
      }
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

  solution_length -= 1;
  document.getElementById(
    "solution-output"
  ).innerText = `Solution Path Length: ${solution_length}`;
}

// 목표 상태
const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

// 랜덤한 초기 상태를 생성하는 함수
function generateRandomPuzzle() {
  const puzzle = [...GOAL_STATE]; // GOAL_STATE에서 배열 복사
  for (let i = 0; i < puzzle.length * 2; i++) {
    const idx1 = Math.floor(Math.random() * puzzle.length);
    const idx2 = Math.floor(Math.random() * puzzle.length);

    // 두 인덱스의 값을 교환
    [puzzle[idx1], puzzle[idx2]] = [puzzle[idx2], puzzle[idx1]];
  }
  return puzzle; // 랜덤하게 섞인 퍼즐 반환
}

// 퍼즐이 목표 상태인지 확인하는 함수
function isSolved(state) {
  // 퍼즐 상태가 목표 상태와 일치하는지 확인
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

// 초기화 버튼을 클릭할 때 호출되는 함수
function resetPuzzle() {
  current_puzzle_state = [...initial_puzzle_state]; // 처음 섞은 상태로 복원
  solution_length = bfs(current_puzzle_state).length; // 초기 상태에서 경로 길이를 다시 계산
  updatePuzzleTiles(current_puzzle_state); // 타일을 초기 상태로 업데이트
  document.getElementById(
    "solution-output"
  ).innerText = `Solution Path Length: ${solution_length}`;
  document.getElementById("Success").innerText = ""; // Solved 메시지 초기화
}

// 정답 제출 버튼 클릭 시 정답 확인
// document.getElementById("submit-button").addEventListener("click", () => {
//   console.log("제출 시 퍼즐 상태:", current_puzzle_state); // 디버깅용 로그

//   if (isSolved(current_puzzle_state)) {
//     document.getElementById("Success").innerText = "성공!";
//   } else {
//     document.getElementById("Success").innerText = "실패! 계속 시도하세요.";
//   }
// });

// 퍼즐 섞기 버튼 클릭 시
document.getElementById("solve-button").addEventListener("click", () => {
  initial_puzzle_state = generateRandomPuzzle(); // 새로운 퍼즐 생성 및 저장
  current_puzzle_state = [...initial_puzzle_state]; // 현재 퍼즐 상태도 동일하게 설정
  updatePuzzleTiles(current_puzzle_state); // HTML 타일 상태 업데이트

  const solution_path = bfs(current_puzzle_state); // BFS 실행
  if (solution_path) {
    solution_length = solution_path.length;
    document.getElementById(
      "solution-output"
    ).innerText = `Solution Path Length: ${solution_length}`;
  } else {
    document.getElementById("solution-output").innerText =
      "해결 불가! 다시 섞어주세요.";

    // 모든 타일에 shake 및 error-border 클래스 추가
    tiles.forEach((tile) => {
      tile.classList.add("shake", "error-border");
    });

    // 애니메이션이 끝난 후에 shake 및 error-border 클래스를 제거
    setTimeout(() => {
      tiles.forEach((tile) => {
        tile.classList.remove("shake", "error-border");
      });
    }, 500); // 애니메이션 시간과 일치
  }
});

// 초기화 버튼 추가
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("reset-button").addEventListener("click", () => {
    resetPuzzle();
  });
});

// BFS 탐색을 사용하여 퍼즐을 해결하는 함수
// BFS 탐색을 사용하여 퍼즐을 해결하는 함수
function bfs(start_state) {
  console.log("초기 상태 퍼즐:", start_state); // 초기 상태 출력

  // 출력 영역 선택
  const stepOutput = document.getElementById("step-output");
  stepOutput.innerHTML = ""; // 초기화

  if (isSolved(start_state)) {
    return [];
  }

  const queue = [[start_state, []]];
  const visited = new Set();

  while (queue.length > 0) {
    const [current_state, path] = queue.shift();
    const state_key = current_state.toString();

    if (visited.has(state_key)) {
      continue; // 이미 방문한 상태면 넘어감
    }

    visited.add(state_key);

    for (let next_state of getNewStates(current_state)) {
      const next_state_key = next_state.toString();
      if (visited.has(next_state_key)) {
        continue; // 이미 방문한 상태면 넘어감
      }

      // 이동한 상태가 목표 상태인지 확인
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

      // 새로운 상태를 큐에 추가 (경로도 함께 추가)
      queue.push([next_state, [...path, next_state]]);
    }
  }

  return null; // 해결 불가능한 경우
}

// 빈 칸(0)의 위치를 찾아 이동 가능한 상태들을 반환하는 함수
function getNewStates(state) {
  const zero_idx = state.indexOf(0); // 빈칸(0)의 위치
  const new_states = [];

  for (let move of MOVES[zero_idx]) {
    const new_state = [...state]; // 상태 복사
    // 빈칸(0)과 인접 타일 교환
    [new_state[zero_idx], new_state[move]] = [
      new_state[move],
      new_state[zero_idx],
    ];
    new_states.push(new_state); // 새로운 상태 추가
  }

  return new_states;
}

// 빈 칸의 이동 가능 방향 (상, 하, 좌, 우)
const MOVES = {
  0: [1, 3], // 빈 칸이 0번 인덱스에 있을 때 이동 가능한 인덱스 (오른쪽, 아래)
  1: [0, 2, 4], // 좌, 우, 아래
  2: [1, 5], // 왼쪽, 아래
  3: [0, 4, 6], // 위, 오른쪽, 아래
  4: [1, 3, 5, 7], // 왼쪽, 오른쪽, 위, 아래
  5: [2, 4, 8], // 왼쪽, 위, 아래
  6: [3, 7], // 위, 오른쪽
  7: [4, 6, 8], // 왼쪽, 오른쪽, 위
  8: [5, 7], // 왼쪽, 위
};
