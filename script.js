// === СПИСОК КАРТИНОК ===
const icons = [
    'priz2.png', 'priz3.png', 'priz4.png', 'priz5.png', 
    'priz6.png', 'priz7.png', 'priz9.png', 'priz10.png', 
    'priz11.png', 'priz12.png'
];

const winIconName = 'priz1.png'; // Победный символ
const columns = 6;
const stopBtn = document.getElementById('stopBtn');
const modal = document.getElementById('modal');
const reelCols = [];
let spinIntervals = [];

// 1. Создаем слоты
for(let i=1; i<=columns; i++) {
    const col = document.getElementById(`col-${i}`);
    reelCols.push(col);
    
    // Начальное заполнение
    let html = '';
    for(let j=0; j<20; j++) {
        const rand = icons[Math.floor(Math.random() * icons.length)];
        html += `<img src="images/${rand}" class="slot-icon">`;
    }
    col.innerHTML = html;
}

// 2. Вращение
function startSpinning() {
    reelCols.forEach((col, index) => {
        let position = 0;
        // Скорость вращения (15 - плавно)
        const speed = 3 + (index * 2); 
        
        const interval = setInterval(() => {
            position -= speed;
            if(position < -1500) position = 0;
            col.style.transform = `translateY(${position}px)`;
        }, 20);
        
        spinIntervals.push(interval);
    });
}

// Запускаем сразу
startSpinning();

// 3. Кнопка СТОП
stopBtn.addEventListener('click', () => {
    stopBtn.disabled = true;
    stopBtn.innerText = "WAIT...";

    spinIntervals.forEach(int => clearInterval(int));
    spinIntervals = [];

    reelCols.forEach((col, i) => {
        setTimeout(() => {
            stopReel(col, i);
        }, i * 400); 
    });
});

function stopReel(col, index) {
    col.innerHTML = "";
    
    // === ЛОГИКА ЦЕНТРИРОВАНИЯ ===
    // Мы хотим видеть: [Top, Winner, Bottom] (индексы 0, 1, 2)
    // Чтобы создать эффект прокрутки вниз, мы добавим 4-й элемент снизу
    // И анимируем сдвиг ленты.
    
    // 1. Верхний видимый (рандом)
    col.appendChild(createImg(icons[Math.floor(Math.random()*icons.length)]));
    
    // 2. ПОБЕДИТЕЛЬ (Центр)
    const winner = createImg(winIconName);
    winner.id = `win-cell-${index}`;
    col.appendChild(winner);
    
    // 3. Нижний видимый (рандом)
    col.appendChild(createImg(icons[Math.floor(Math.random()*icons.length)]));
    
    // 4. Буферный элемент (тот, который уезжает вниз)
    col.appendChild(createImg(icons[Math.floor(Math.random()*icons.length)]));

    // === АНИМАЦИЯ ===
    // Шаг 1: Ставим ленту так, чтобы мы видели элементы 1, 2, 3 (сдвиг вверх на 1 ячейку = -33.33%)
    // Это создает ощущение, что лента еще не остановилась
    col.style.transition = 'none';
    col.style.transform = 'translateY(-33.333%)';
    
    // Принудительная перерисовка
    col.offsetHeight; 
    
    // Шаг 2: Плавно сдвигаем ленту в 0 (видим элементы 0, 1, 2)
    // Элементы как бы "падают" сверху на свои места. Победитель встает в центр.
    col.style.transition = 'transform 1.2s cubic-bezier(0.2, 1, 0.3, 1)'; // Эффект торможения
    col.style.transform = 'translateY(0)';
    
    if(index === columns - 1) {
        setTimeout(showWin, 1500);
    }
}

function createImg(filename) {
    const img = document.createElement('img');
    img.src = `images/${filename}`;
    img.className = 'slot-icon';
    return img;
}

function showWin() {
    stopBtn.innerText = "WON!";
    
    for(let i=0; i<columns; i++) {
        const cell = document.getElementById(`win-cell-${i}`);
        if(cell) cell.classList.add('win-highlight');
    }
    
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 3000);
}

document.querySelector('.claim-btn').addEventListener('click', () => {
    alert("Переход на регистрацию...");

});
