// menu.js
document.addEventListener('DOMContentLoaded', function () {
    const nav = `
      <nav>
        <ul>
          <li><a href="index.html">Emotion Flow</a></li>
          <li><a href="menu.html#sadness" onclick="showPage('sadness')">Sadness</a></li>
          <li><a href="menu.html#happiness" onclick="showPage('happiness')">Happiness</a></li>
          <li><a href="menu.html#anger" onclick="showPage('anger')">Anger</a></li>
          <li><a href="menu.html#fear" onclick="showPage('fear')">Fear</a></li>
          <li><a href="menu.html#love" onclick="showPage('love')">Love</a></li>
        </ul>
      </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', nav); // 네비게이션 바를 body의 맨 처음에 삽입
});
