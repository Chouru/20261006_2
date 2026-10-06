// 定義測驗題目資料庫（共 5 題 p5.js 基礎指令測驗）
let questions = [
  {
    question: "1. 在 p5.js 中，哪一個函式只會在程式開始時執行一次？",
    options: ["draw()", "setup()", "createCanvas()", "mousePressed()"],
    answer: 1 // 正確答案索引（0開始，1代表 setup()）
  },
  {
    question: "2. 下列哪一個指令可以用來繪製一個圓形？",
    options: ["rect()", "line()", "circle()", "triangle()"],
    answer: 2 // circle()
  },
  {
    question: "3. 若要設定畫布背景色彩，應該使用哪一個指令？",
    options: ["background()", "fill()", "stroke()", "color()"],
    answer: 0 // background()
  },
  {
    question: "4. 下列哪一個變數可以用來取得目前滑鼠的 X 軸座標？",
    options: ["mouseX", "mouseY", "width", "height"],
    answer: 0 // mouseX
  },
  {
    question: "5. 若要設定填滿形狀內部的顏色，應該使用哪一個指令？",
    options: ["stroke()", "noFill()", "fill()", "colorMode()"],
    answer: 2 // fill()
  }
];

// 狀態控制變數
let currentQuestionIndex = 0; // 目前第幾題
let score = 0;                 // 累計答對題數
let selectedOption = -1;       // 玩家選擇的選項索引（-1 表示尚未選擇）
let isAnswered = false;        // 是否已經作答當前題目
let animAngle = 0;             // 用於正確選項跳動動畫的角度變數

// 按鈕與版面佈局參數
let optionButtons = [];        // 儲存 4 個選項按鈕的範圍資訊
let nextButtonRect = {};       // 儲存下一題按鈕的範圍資訊

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定文字對齊方式為居中
  textAlign(CENTER, CENTER);
}

function draw() {
  // 清除背景，使用柔和的淺灰色
  background(245);

  // 判斷是否已完成所有題目
  if (currentQuestionIndex >= questions.length) {
    // 顯示最終結算畫面
    drawResultScreen();
  } else {
    // 繪製當前題目與選項
    drawQuizScreen();
  }
}

// 繪製測驗畫面
function drawQuizScreen() {
  let currentQ = questions[currentQuestionIndex];

  // 1. 繪製題目文字
  fill(30);
  noStroke();
  textSize(28);
  text(currentQ.question, width / 2, height * 0.18);

  // 2. 設定選項按鈕尺寸與位置參數
  let btnWidth = min(width * 0.6, 500); // 按鈕寬度上限 500px
  let btnHeight = 55;                   // 按鈕高度
  let startY = height * 0.32;           // 第一個按鈕起始 Y 座標
  let spacing = 70;                     // 按鈕間距

  optionButtons = []; // 重置按鈕範圍陣列

  // 3. 繪製 4 個選項
  for (let i = 0; i < currentQ.options.length; i++) {
    let x = width / 2 - btnWidth / 2;
    let y = startY + i * spacing;

    // 計算預設或答對跳動時的 Y 偏移量
    let offsetY = 0;

    // 判斷按鈕背景顏色與跳動效果
    if (isAnswered) {
      if (i === currentQ.answer) {
        // 如果是正確選項
        fill('#caf0f8'); // 設定指定背景顏色 #caf0f8
        
        // 若答錯，讓正確選項上下跳動（利用正弦波動畫）
        if (selectedOption !== currentQ.answer) {
          offsetY = sin(animAngle) * 8; 
          animAngle += 0.15; // 增加動畫角度以持續跳動
        }
      } else if (i === selectedOption) {
        // 如果是玩家選錯的選項，顯示淺紅色以提示選錯
        fill(255, 200, 200);
      } else {
        // 其他非選擇且非正確的選項保持白色
        fill(255);
      }
    } else {
      // 尚未作答時預設為白色
      fill(255);
    }

    // 繪製選項卡片外框與圓角矩形
    stroke(200);
    strokeWeight(2);
    rect(x, y + offsetY, btnWidth, btnHeight, 12);

    // 繪製選項文字
    noStroke();
    fill(40);
    textSize(20);
    text(currentQ.options[i], width / 2, y + offsetY + btnHeight / 2);

    // 紀錄按鈕邊界以便滑鼠點擊判定
    optionButtons.push({
      x: x,
      y: y + offsetY,
      w: btnWidth,
      h: btnHeight,
      index: i
    });
  }

  // 4. 作答後顯示「下一題」或「看結果」按鈕
  if (isAnswered) {
    let nextW = 160;
    let nextH = 50;
    let nextX = width / 2 - nextW / 2;
    let nextY = startY + 4 * spacing + 20;

    // 繪製下一題按鈕背景
    fill('#0077b6');
    noStroke();
    rect(nextX, nextY, nextW, nextH, 25);

    // 繪製下一題按鈕文字
    fill(255);
    textSize(20);
    let btnText = (currentQuestionIndex === questions.length - 1) ? "查看結果" : "下一題";
    text(btnText, width / 2, nextY + nextH / 2);

    // 紀錄下一題按鈕區域
    nextButtonRect = { x: nextX, y: nextY, w: nextW, h: nextH };
  }
}

// 繪製最終結算畫面
function drawResultScreen() {
  fill(30);
  noStroke();
  textSize(36);
  text("測驗完成！", width / 2, height * 0.35);

  // 顯示得分狀況
  textSize(28);
  fill('#0077b6');
  text(`你一共答對了 ${score} / ${questions.length} 題`, width / 2, height * 0.48);

  // 繪製重新開始按鈕
  let restartW = 180;
  let restartH = 50;
  let restartX = width / 2 - restartW / 2;
  let restartY = height * 0.6;

  fill(72, 149, 239);
  rect(restartX, restartY, restartW, restartH, 25);

  fill(255);
  textSize(20);
  text("重新挑戰", width / 2, restartY + restartH / 2);

  nextButtonRect = { x: restartX, y: restartY, w: restartW, h: restartH };
}

// 滑鼠點擊事件處理
function mousePressed() {
  // 1. 如果在測驗狀態中
  if (currentQuestionIndex < questions.length) {
    if (!isAnswered) {
      // 檢測是否點擊了某個選項按鈕
      for (let btn of optionButtons) {
        if (mouseX > btn.x && mouseX < btn.x + btn.w &&
            mouseY > btn.y && mouseY < btn.y + btn.h) {
          selectedOption = btn.index;
          isAnswered = true;

          // 判斷是否答對並累加分數
          if (selectedOption === questions[currentQuestionIndex].answer) {
            score++;
          }
          break;
        }
      }
    } else {
      // 已經作答，檢測是否點擊「下一題」按鈕
      if (mouseX > nextButtonRect.x && mouseX < nextButtonRect.x + nextButtonRect.w &&
          mouseY > nextButtonRect.y && mouseY < nextButtonRect.y + nextButtonRect.h) {
        currentQuestionIndex++; // 進入下一題
        isAnswered = false;     // 重置作答狀態
        selectedOption = -1;    // 重置選擇選項
        animAngle = 0;          // 重置動畫角度
      }
    }
  } 
  // 2. 如果在最終結算畫面，點擊重新挑戰
  else {
    if (mouseX > nextButtonRect.x && mouseX < nextButtonRect.x + nextButtonRect.w &&
        mouseY > nextButtonRect.y && mouseY < nextButtonRect.y + nextButtonRect.h) {
      currentQuestionIndex = 0;
      score = 0;
      isAnswered = false;
      selectedOption = -1;
      animAngle = 0;
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布尺寸以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}