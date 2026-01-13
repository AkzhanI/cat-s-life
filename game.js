let coins = 0;
let hunger = 100;
let catX = 200; // текущая позиция кота
let targetX = 200; // куда кот должен ехать
let isPlaying = false;

const box = document.getElementById('game-box');
const cat = document.getElementById('cat');
const speed = 6; // скорость движения кота (px за кадр)

// ===== ДВИЖЕНИЕ ПО КЛИКУ =====
box.onclick = function(e) {
    if (!isPlaying || !document.getElementById('shop-screen').classList.contains('hidden')) return;
    const rect = box.getBoundingClientRect();
    const catWidth = cat.offsetWidth * 0.6;
    let clickX = e.clientX - rect.left;

    // ограничиваем, чтобы кот полностью оставался внутри
    targetX = Math.min(Math.max(clickX, 0), rect.width - catWidth);
};

// ===== ДВИЖЕНИЕ СТРЕЛКАМИ =====
document.addEventListener("keydown", (e) => {
    if (!isPlaying) return;
    const catWidth = cat.offsetWidth * 0.6;
    const maxX = box.offsetWidth - catWidth;

    if (e.key === "ArrowLeft") targetX = Math.max(targetX - 50, 0);
    if (e.key === "ArrowRight") targetX = Math.min(targetX + 50, maxX);
});

// ===== ПЛАВНОЕ ДВИЖЕНИЕ =====
function moveCat() {
    if (Math.abs(catX - targetX) > 1) {
        catX += (targetX - catX) * 0.2; // плавность
        cat.style.left = catX + "px";
    }
    requestAnimationFrame(moveCat);
}
requestAnimationFrame(moveCat);

// ===== СТАРТ ИГРЫ =====
function play() {
    if (isPlaying) return;
    isPlaying = true;

    const startScreen = document.getElementById('start-screen');
    if (startScreen) startScreen.classList.add('hidden');

    setInterval(dropItem, 2000);

    setInterval(() => {
        if (!isPlaying) return;
        hunger -= 1;
        document.getElementById('hunger-txt').innerText = "🍖: " + hunger;
        if (hunger <= 0) {
            gameOver();
        }
    }, 1500);
}

// ===== ПАДЕНИЕ ПРЕДМЕТОВ =====
function dropItem() {
    const shopScreen = document.getElementById('shop-screen');
    if (!isPlaying || (shopScreen && !shopScreen.classList.contains('hidden'))) return;

    const item = document.createElement('div');
    const isCoin = Math.random() > 0.7;
    item.className = 'item';
    item.innerText = isCoin ? '💰' : '🐟';

    const itemWidth = 30;
    const maxX = box.offsetWidth - itemWidth;
    let itemX = Math.random() * maxX;
    item.style.left = itemX + 'px';
    item.style.top = '-50px';
    box.appendChild(item);

    let itemY = -50;
    const fall = setInterval(() => {
        if (shopScreen && !shopScreen.classList.contains('hidden')) {
            clearInterval(fall);
            item.remove();
            return;
        }

        itemY += 5;
        item.style.top = itemY + 'px';

        // проверка, поймал ли кот
        const catWidth = cat.offsetWidth * 0.6;
        if (itemY > box.offsetHeight - 120 && itemY < box.offsetHeight - 50) {
            if (Math.abs(itemX - catX) < catWidth) {
                if (isCoin) {
                    coins += 10;
                    document.getElementById('score-txt').innerText = "💰: " + coins;
                } else {
                    hunger = Math.min(hunger + 15, 100);
                    document.getElementById('hunger-txt').innerText = "🍖: " + hunger;
                }

                cat.style.transform = 'scale(0.7)';
                setTimeout(() => cat.style.transform = 'scale(0.6)', 150);

                clearInterval(fall);
                item.remove();
            }
        }

        if (itemY > box.offsetHeight) {
            clearInterval(fall);
            item.remove();
        }
    }, 30);
}

// ===== МАГАЗИН =====
function toggleShop() {
    const shopScreen = document.getElementById('shop-screen');
    if (shopScreen) shopScreen.classList.toggle('hidden');
}

function buySkin(skinType, price) {
    if (coins >= price) {
        coins -= price;
        document.getElementById('score-txt').innerText = "💰: " + coins;

        if (skinType === 'gold') cat.style.background = "gold";
        if (skinType === 'cosmo') cat.style.background = "linear-gradient(to right, pink, skyblue)";
        alert("Скин применен!");
        toggleShop();
    } else {
        alert("Нужно больше золота! (Лови монетки)");
    }
}

// ===== ИГРА ОКОНЧЕНА =====
function gameOver() {
    isPlaying = false;
    alert("Игра окончена! 😿 Попробуй снова.");
    // можно показать экран рестарта
}
