const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

// 정적 파일 제공 (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Python 스크립트 실행 및 결과 반환
app.get("/solve-puzzle", (req, res) => {
  exec("python3 puzzle.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return res.status(500).send("Error solving puzzle");
    }

    // Python 스크립트의 출력값(stdout)을 클라이언트에 JSON 형태로 전달
    const pathLength = parseInt(stdout.trim()); // 문자열을 숫자로 변환
    res.json({ solution: pathLength });
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
