// Inicializace proměnných pro herní plochu, dinosaura, kaktusy a další parametry
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Vlastnosti dinosaura
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

// Pole pro ukládání objektů kaktusů
let cactusArray = [];

// Vlastnosti kaktusů
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Proměnné pro rychlost, gravitaci, stav hry a skóre
let velocityX = -10;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

// Událost pro načtení okna
window.onload = function() {
    // Získání elementu canvasu a nastavení jeho rozměrů
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    // Získání 2D kontextu pro kreslení na canvasu
    context = board.getContext("2d");

    // Načtení obrázku dinosaura
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // Načtení obrázků kaktusů
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    // Inicializace herní smyčky a umístění kaktusů
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", moveDino);
}

// Funkce pro aktualizaci hry (herní smyčka)
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Působení gravitace na svislou rychlost dinosaura
    velocityY += gravity;
    // Aktualizace pozice dinosaura na základě rychlosti
    dino.y = Math.min(dino.y + velocityY, dinoY);
    // Kreslení dinosaura na canvas
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Aktualizace a kreslení každého kaktusu
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Kontrola kolize mezi dinosaurem a kaktusem
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    // Zobrazení skóre na canvasu
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

// Událost pro pohyb dinosaura
function moveDino(e) {
    if (gameOver) {
        return;
    }

    // Skok při stisknutí mezerníku nebo šipky nahoru a pokud je dinosaurus na zemi
    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10;
    }
    // Další funkcionalita pro šipku dolů (není implementováno v tomto kódu)
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
    }
}

// Funkce pro umisťování kaktusů v náhodných intervalech
function placeCactus() {
    if (gameOver) {
        return;
    }

    // Vytvoření nového objektu kaktusu
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    // Náhodný výběr typu kaktusu a nastavení jeho vlastností
    let placeCactusChance = Math.random();
    if (placeCactusChance > .90) { 
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { 
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { 
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    // Omezení počtu kaktusů na obrazovce
    if (cactusArray.length > 5) {
        cactusArray.shift(); 
    }
}

// Funkce pro detekci kolize mezi dvěma objekty
function detectCollision(a, b) {
    return a.x < b.x + b.width &&  
           a.x + a.width > b.x &&  
           a.y < b.y + b.height && 
           a.y + a.height > b.y;
}
