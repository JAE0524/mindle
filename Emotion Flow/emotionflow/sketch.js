let italianaFont;
let mcardiacImg;

function preload() {
    italianaFont = loadFont('../assets/Italiana-Regular.ttf'); // 폰트 로드
    mcardiacImg = loadImage('../svg/m_cardiac.svg'); // SVG 이미지 로드
}

function setup() {
    createCanvas(windowWidth, windowHeight); // 캔버스 크기 설정
    noLoop(); // draw() 반복 방지
    imageMode(CENTER); // 이미지 중앙 정렬 설정
}

function draw() {
    background('#fafaf4'); // 배경 초기화

    // vmin (화면 크기의 15%)
    let size = min(windowWidth, windowHeight) * 0.15;
    let strokeThickness = size * 0.02; // strokeWeight를 2% 비율로 설정
    let imgWidth = width / 3; // 이미지의 너비를 화면 너비의 1/3으로 설정
    let imgHeight = (mcardiacImg.height / mcardiacImg.width) * imgWidth; // 이미지 비율 유지

    // 이미지 중앙에 배치
    image(mcardiacImg, width / 2, height / 2, imgWidth, imgHeight);

    // 텍스트 설정
    textFont(italianaFont); // 폰트 설정
    textSize(size); // 텍스트 크기 설정
    stroke('#5A3F3F');
    strokeWeight(strokeThickness); // 반응형 선 두께 설정
    noFill();
    textAlign(CENTER, CENTER); // 텍스트 중앙 정렬
    text('Emotion Flow', width / 2, height / 2); // 텍스트 출력
}

// 창 크기 변경 시 호출
function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // 캔버스 크기 재조정
    redraw(); // 텍스트 새로 그리기
}
