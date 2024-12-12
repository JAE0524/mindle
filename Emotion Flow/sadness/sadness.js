let italianaFont;
let drops = []; // 비 드롭 배열
let scardiacImg; // SVG 이미지

// 물리 계산을 위한 변수 선언
let centerX = 0.0;
let centerY = 0.0;
let radius;
let rotAngle = -90; // 회전 각도 초기값
let accelX = 0.0; // X축 가속도
let accelY = 0.0; // Y축 가속도
let deltaX = 0.0; // X축 변화량
let deltaY = 0.0; // Y축 변화량
let springing = 0.0003; // 스프링 효과
let damping = 0.98; // 감쇠 효과 (속도 감소)

// 다각형 꼭짓점을 위한 변수 선언
let nodes = 10; // 다각형의 꼭짓점 수
let nodeStartX = []; // 각 꼭짓점의 시작 X 위치
let nodeStartY = []; // 각 꼭짓점의 시작 Y 위치
let nodeX = []; // 각 꼭짓점의 현재 X 위치
let nodeY = []; // 각 꼭짓점의 현재 Y 위치
let angle = []; // 각 꼭짓점의 각도
let frequency = []; // 각 꼭짓점의 주파수 (속도 변화)

// 곡선 타이트니스 (구부러짐 정도)를 위한 변수 선언
let organicConstant = 50.0;

function preload() {
    italianaFont = loadFont('../assets/Italiana-Regular.ttf'); // 폰트 로드
    scardiacImg = loadImage('../svg/s_cardiac.svg'); // SVG 이미지 로드
}

function setup() {
    createCanvas(windowWidth, windowHeight); // 캔버스 크기 설정
    radius = min(windowWidth, windowHeight) * 0.03; // 다각형의 반지름을 화면 크기의 3%로 설정

    // 비 드롭을 300개 생성하여 drops 배열에 추가
    for (let i = 0; i < 300; i++) {
        let drop = {
            x: random(width), // 드롭의 랜덤 x 위치
            y: random(-500, -50), // 화면 밖에서 시작하는 랜덤 y 위치
            speed: random(0.5, 5), // 드롭의 속도 (0.5에서 5 사이)
        };
        drops.push(drop); // drops 배열에 추가
    }

    // 다각형의 중심을 캔버스 중앙으로 설정
    centerX = width / 2;
    centerY = height / 2;

    // 노드 배열을 0으로 초기화
    for (let i = 0; i < nodes; i++) {
        nodeStartX[i] = 0;
        nodeStartY[i] = 0;
        nodeX[i] = 0;
        nodeY[i] = 0;
        angle[i] = 0;
    }

    // 각 노드의 주파수 초기화 (랜덤 주파수 부여)
    for (let i = 0; i < nodes; i++) {
        frequency[i] = random(5, 12);
    }

    noStroke(); // 선을 그리지 않음
    angleMode(DEGREES); // 각도 단위를 '도'로 설정
}

function draw() {
    background(25, 19, 19, 20); // 반투명 배경 설정으로 잔상 효과

    // 이미지 비율을 유지하며 크기 설정
    let imgWidth = width / 3; // 이미지의 너비를 화면 너비의 1/3으로 설정
    let imgHeight = (scardiacImg.height / scardiacImg.width) * imgWidth; // 이미지 비율 유지

    // 마우스 위치에 따라 회전 각도 계산
    let angleZ = map(mouseX, 0, width, -PI / 1, PI / 1); // 마우스 X 위치에 따라 회전 각도 결정

    // 이미지 그리기 전에 중심을 맞추고 회전 적용
    push(); // 상태 저장
    translate(width / 2, height / 2); // 캔버스 중심으로 이동
    rotate(angleZ); // Z축 기준으로 회전
    imageMode(CENTER); // 이미지가 중심에서 그려지도록 설정
    image(scardiacImg, 0, 0, imgWidth, imgHeight); // 이미지 그리기
    pop(); // 상태 복원

    // 비 드롭 그리기
    for (let i = drops.length - 1; i >= 0; i--) {
        let drop = drops[i];

        // 마우스와 드롭 간의 거리 계산
        let mouseDirection = createVector(drop.x - mouseX, drop.y - mouseY);
        let distance = mouseDirection.mag();

        // 마우스와 가까운 드롭은 배열에서 제거
        if (distance < 200) {
            drops.splice(i, 1); // 드롭 제거
        } else {
            drop.y += drop.speed; // 드롭이 떨어지는 효과 (y값 증가)

            stroke('#5c639d'); // 드롭의 색상 (파란색)
            strokeWeight(2); // 선 두께 설정
            line(drop.x, drop.y, drop.x, drop.y + 500); // 드롭 선 그리기
        }

        // 드롭이 화면 아래로 떨어지면, 다시 위로 이동
        if (drop.y > height) {
            drops[i] = {
                x: random(width), // 새로운 랜덤 x 위치
                y: random(-500, -50), // 화면 밖에서 다시 시작하는 랜덤 y 위치
                speed: random(0.5, 5), // 새로운 속도 설정
            };
        }
    }

    // 물리적 효과를 이용해 움직이는 다각형 그리기
    drawShape();
    moveShape();

    // 화면에 텍스트 추가
    let size = min(windowWidth, windowHeight) * 0.15; // 텍스트 크기 설정 (화면 크기의 15%)
    noStroke();
    fill('#914b4b'); // 텍스트 색상 설정
    textFont(italianaFont); // 폰트 설정
    textSize(size); // 텍스트 크기 설정
    textAlign(CENTER, CENTER); // 텍스트 중앙 정렬
    text('Sadness', width / 2, height / 2); // 텍스트 출력
}

function drawShape() {
    // 다각형의 노드 시작 위치 계산
    for (let i = 0; i < nodes; i++) {
        nodeStartX[i] = centerX + cos(rotAngle) * radius; // X 좌표 계산
        nodeStartY[i] = centerY + sin(rotAngle) * radius; // Y 좌표 계산
        rotAngle += 360.0 / nodes; // 각도를 고르게 분배
    }

    // 다각형을 그리기 위한 곡선 타이트니스 설정
    curveTightness(organicConstant); // 곡선의 구부러짐 정도 설정
    let shapeColor = lerpColor(color('#914b4b'), color('#191313'), organicConstant); // 색상 보간
    fill(shapeColor); // 다각형 색상 설정
    noStroke(); // 외곽선 제거

    beginShape();
    // 다각형을 구성하는 각 노드를 연결하여 다각형을 그리기
    for (let i = 0; i < nodes; i++) {
        curveVertex(nodeX[i], nodeY[i]); // 각 노드 연결
    }
    endShape(CLOSE); // 다각형 닫기
}

function moveShape() {
    // 다각형 중심을 마우스 위치로 이동시키는 물리적 효과
    deltaX = mouseX - centerX; // X축 차이
    deltaY = mouseY - centerY; // Y축 차이

    // 스프링 효과 적용
    deltaX *= springing;
    deltaY *= springing;
    accelX += deltaX;
    accelY += deltaY;

    // 다각형 중심 이동
    centerX += accelX;
    centerY += accelY;

    // 감쇠 효과 (속도 감소)
    accelX *= damping;
    accelY *= damping;

    // 가속도에 따른 곡선의 타이트니스 조정
    organicConstant = 1 - (abs(accelX) + abs(accelY)) * 0.1;

    // 노드 이동
    for (let i = 0; i < nodes; i++) {
        nodeX[i] = nodeStartX[i] + sin(angle[i]) * (accelX * 1);
        nodeY[i] = nodeStartY[i] + sin(angle[i]) * (accelY * 1);
        angle[i] += frequency[i]; // 주파수에 따른 각도 변화
    }
}

// 창 크기 변경 시 호출되는 함수
function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // 캔버스 크기 재조정
    redraw(); // 텍스트 새로 그리기
}
