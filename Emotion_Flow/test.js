// 다각형의 반지름과 관련된 상수들
const POLYGON_RADIUS = 100; // 다각형의 반지름
const POLYGON_VERTEX_COUNT = 10; // 다각형의 꼭짓점 개수
const HIGH_GAUSSIAN_CONSTANT = POLYGON_RADIUS * 0.6; // 높은 변형 정도를 위한 가우시안 상수
const LOW_GAUSSIAN_CONSTANT = POLYGON_RADIUS * 0.2; // 낮은 변형 정도를 위한 가우시안 상수
const POLYGON_DEFORMATION_COUNT = 4; // 다각형의 변형 횟수
const OPACITY = 200; // 색상의 불투명도 값 (0-255)

// setup() 함수: 초기 설정
function setup() {
    createCanvas(windowWidth, windowHeight); // 캔버스를 브라우저 창 크기에 맞게 생성
    background(255, 255, 255); // 배경을 흰색으로 설정
    noLoop(); // draw 함수가 한 번만 실행되도록 설정
}

// 지정된 범위 내에서 랜덤한 정수 값을 반환하는 함수
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// 어두운 빨간색을 생성하는 함수 (붉은색 값만 높게, 초록과 파랑은 낮추기)
function randomDarkRed() {
    return randomInt(150, 255); // 빨간색을 어두운 범위로 제한
}

// 초록색 값을 낮게 설정
function randomGreen() {
    return randomInt(0, 100); // 초록색을 낮게 설정
}

// 파란색 값을 낮게 설정
function randomBlue() {
    return randomInt(0, 100); // 파란색을 낮게 설정
}

// draw() 함수: 화면에 다각형을 그리는 함수
function draw() {
    // 여기서는 이전 도형을 지우기 위해 클릭 시마다 배경을 흰색으로 설정합니다.
    const red = randomDarkRed(); // 랜덤 어두운 빨간색 값
    const green = randomGreen(); // 랜덤 초록색 값
    const blue = randomBlue(); // 랜덤 파란색 값
    fill(red, green, blue, OPACITY); // 랜덤 색상으로 채우기, 불투명도 설정
    stroke(red, green, blue, OPACITY); // 랜덤 색상으로 테두리 설정, 불투명도 설정
    translate(width * 0.5, height * 0.5); // 화면의 중심으로 이동
    deformedPolygon(POLYGON_RADIUS, POLYGON_VERTEX_COUNT, POLYGON_DEFORMATION_COUNT); // 변형된 다각형 그리기
}

// 정해진 반지름과 꼭짓점 개수로 다각형을 그리는 함수
function polygon(radius, numPoints) {
    let angle = TWO_PI / numPoints; // 각 꼭짓점 사이의 각도
    beginShape(); // 도형 그리기를 시작
    for (let degrees = 0; degrees < TWO_PI; degrees += angle) {
        let aX = cos(degrees) * radius; // 첫 번째 꼭짓점의 X 좌표
        let aY = sin(degrees) * radius; // 첫 번째 꼭짓점의 Y 좌표
        let cX = cos(degrees + angle) * radius; // 두 번째 꼭짓점의 X 좌표
        let cY = sin(degrees + angle) * radius; // 두 번째 꼭짓점의 Y 좌표
        vertex(aX, aY); // 첫 번째 꼭짓점
        vertex(cX, cY); // 두 번째 꼭짓점
    }
    endShape(CLOSE); // 도형 그리기를 종료하고 닫음
}

// 변형된 다각형을 그리는 함수
function deformedPolygon(radius, numPoints, numDeformations) {
    // 변형된 경계를 그리는 재귀 함수
    function deformEdge(aX, aY, cX, cY, deformationCount) {
        if (deformationCount < numDeformations) {
            // 지정된 변형 횟수보다 적을 경우에만 실행
            // ac의 중간점을 계산
            let bX = aX + cX / 2;
            let bY = aY + cY / 2;

            // 가우시안 분포를 사용하여 b'를 계산
            let bPrimeX = randomGaussian(bX, HIGH_GAUSSIAN_CONSTANT);
            let bPrimeY = randomGaussian(bY, HIGH_GAUSSIAN_CONSTANT);

            // ac를 ab'와 b'c로 변형
            vertex(aX, aY);
            vertex(bPrimeX, bPrimeY);
            deformEdge(aX, aY, bPrimeX, bPrimeY, deformationCount + 1); // 첫 번째 절반에 대해 재귀 호출
            deformEdge(bPrimeX, bPrimeY, cX, cY, deformationCount + 1); // 두 번째 절반에 대해 재귀 호출
        }
    }

    let angle = TWO_PI / numPoints; // 각 꼭짓점 사이의 각도
    let deformationCount = 0; // 변형 횟수 초기화
    beginShape(); // 도형 그리기를 시작
    for (let degrees = 0; degrees < TWO_PI; degrees += angle) {
        let aX = cos(degrees) * radius; // 첫 번째 꼭짓점의 X 좌표
        let aY = sin(degrees) * radius; // 첫 번째 꼭짓점의 Y 좌표
        let cX = cos(degrees + angle) * radius; // 두 번째 꼭짓점의 X 좌표
        let cY = sin(degrees + angle) * radius; // 두 번째 꼭짓점의 Y 좌표

        deformEdge(aX, aY, cX, cY, deformationCount); // 경계를 변형하는 함수 호출
    }
    endShape(CLOSE); // 도형 그리기를 종료하고 닫음
}

// 클릭 시 새로 그리기
function mousePressed() {
    background(255); // 클릭 시 배경을 흰색으로 다시 설정하여 이전 도형을 지웁니다.
    redraw(); // 클릭할 때마다 새로 그리도록 설정
}
