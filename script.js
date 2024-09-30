const puzzle = document.querySelector(".puzzle");
const tiles = Array.from(document.querySelectorAll(".tile"));

puzzle.addEventListener("click", (e) => {
  const tile = e.target;
  if (!tile.classList.contains("empty")) {
    const emptyTile = document.querySelector(".empty");
    const tileIndex = tiles.indexOf(tile);
    const emptyIndex = tiles.indexOf(emptyTile);

    // 인접한 타일인지 확인 (상하좌우 인접)
    if (isAdjacent(tileIndex, emptyIndex)) {
      // 타일과 빈칸의 위치를 교환
      swapTiles(tile, emptyTile);
    }
  }
});

function isAdjacent(index1, index2) {
  const row1 = Math.floor(index1 / 3);
  const col1 = index1 % 3;
  const row2 = Math.floor(index2 / 3);
  const col2 = index2 % 3;

  return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

function swapTiles(tile1, tile2) {
  const temp = tile1.textContent;
  tile1.textContent = tile2.textContent;
  tile2.textContent = temp;

  tile1.classList.toggle("empty");
  tile2.classList.toggle("empty");
}
