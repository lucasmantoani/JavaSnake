
// JavaScript Snake Game

var canvas; // Ca
var ctx;

var head; // Variables qui vont servir à stocker les images de Snake.
var apple;
var ball;

var dots; // Variables qui vont servir au déplacement et à l'apparition aléatoire des pommes
var apple_x;
var apple_y;

var leftDirection = false;  // Ces quatres variables sont les directions de déplacement du serpent.
var rightDirection = true;  // Par défaut elles sont toutes à False sauf rightDirection, ce qui signifie qu'a chaque début de partie,
var upDirection = false;    // la direction de départ du serpent sera à droite !
var downDirection = false;
var inGame = true;    

const DOT_SIZE = 10;    // Taille des pommes et des dots du serpent 
const ALL_DOTS = 900;   // Nombre maximum de dots du serpent possible
const MAX_RAND = 29;    // Utilisé pour faire apparaître une pomme de façon random
const DELAY = 100;      // Delay = vitesse du jeu en ms
const C_HEIGHT = 400;   // Hauteur du Canevas
const C_WIDTH = 500;    // Largeur du Canevas

const LEFT_KEY = 37;    // Des constantes utilisés pour une meilleure utilisation des touches du clavier (fléches gauche, haut, bas et droite)
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

var x = new Array(ALL_DOTS); // Variables qui stockent la position des dots du serpent pour le déplacement en chaîne
var y = new Array(ALL_DOTS);   


function init() { // Lancement du jeu, la fonction appelle des fonctions plus bas
    
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');

    loadImages();
    createSnake();
    locateApple();
    setTimeout("gameCycle()", DELAY);
}    

function loadImages() { // Fonction qui charge les images du jeu
    
    head = new Image();
    head.src = 'assets/head.png';    
    
    ball = new Image();
    ball.src = 'assets/dot.png'; 
    
    apple = new Image();
    apple.src = 'assets/apple.png'; 
}

function createSnake() { //Fonction de création du Snake, ici initialisé à 2 dots (tête + un corps)

    dots = 2;

    for (var z = 0; z < dots; z++) { // A la création du Snake, il sera à 60 sur l'axe X et 100 sur Y à chaques fois
        x[z] = 60 - z * 10;
        y[z] = 100;
    }
}

function checkApple() { // Si la tête du serpent touche une pomme, on incrémente le corps de un, et locateapple() replace une nouvelle pomme de façon aléatoire.

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
    }
}    

function doDrawing() {
    
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    
    if (inGame) {

        ctx.drawImage(apple, apple_x, apple_y);

        for (var z = 0; z < dots; z++) {
            
            if (z == 0) {   // Si la tête arrive à un endroit ou il n'y a rien, le corps prend la place de la tête au mouvement suivant etc..
                ctx.drawImage(head, x[z], y[z]);    
            } else {
                ctx.drawImage(ball, x[z], y[z]);
            }
        }    
    } else {

        gameOver();         // Si la tête arrive sur le corps ou sort du cadre, game over.
    }        
}

function gameOver() {           // Fonction qui gère le Game over : Affichage d'un message si la partie est perdue.
    
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 24px helvetica';
    
    ctx.fillText('Game over, try again !', C_WIDTH/2, C_HEIGHT/3);
}

function checkApple() {         // Si la tête touche une pomme, on incrémente de 1 le corps du serpent et on appelle locateApple() pour en faire apparaître une nouvelle.

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
    }
}

function move() {  /* Fonction clé du jeu, la fonction mouvement :
                   Le serpent est dirigé par sa tête, que l'on dirige grâce aux flèches directionnelles.
                   Le reste du corps suit le mouvement comme une chaîne, si bien que :
                   Si la tête tourne à gauche, le premier bloc de corps se place à cette position au mouvement suivant.
                   Puis le troisième se place dans la case du second, et ainsi de suite.
                   La position est gérée par l'axe X et Y, en incrémentant de Y, le serpent descend, en décrémentant, il monte. 
                   En incrémentant de X, il va à gauche, en décrémentant, à droite. */

    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }

    if (leftDirection) {
        x[0] -= DOT_SIZE;
    }

    if (rightDirection) {
        x[0] += DOT_SIZE;
    }

    if (upDirection) {
        y[0] -= DOT_SIZE;
    }

    if (downDirection) {
        y[0] += DOT_SIZE;
    }
}    

function checkCollision() { // Fonction qui vérifie si la tête cogne le corps du serpent, dans ce cas le jeu s'arrête.
                            // (Fonction trouvée grâce à Freecodecamp.org)

    for (var z = dots; z > 0; z--) {

        if ((z > 4) && (x[0] == x[z]) && (y[0] == y[z])) {
            inGame = false;
        }
    }

    if (y[0] >= C_HEIGHT) {
        inGame = false;
    }

    if (y[0] < 0) {
       inGame = false;
    }

    if (x[0] >= C_WIDTH) {
      inGame = false;
    }

    if (x[0] < 0) {
      inGame = false;
    }
}

function locateApple() {    // La fonction selectionne de façon aléatoire des coordonnées x et y pour l'apparition de pommes.
                            // (Fonction trouvée grâce à Freecodecamp.org)
    var r = Math.floor(Math.random() * MAX_RAND);
    apple_x = r * DOT_SIZE;

    r = Math.floor(Math.random() * MAX_RAND);
    apple_y = r * DOT_SIZE;
}    

function gameCycle() {      // Fonction de lancement du jeu, qui initialise les fonctions utilisées dans la partie.
    if (inGame) {

        checkApple();
        checkCollision();
        move();
        doDrawing();
        setTimeout("gameCycle()", DELAY);
    }
}

onkeydown = function(e) { // Fonction qui gère le déplacement grâce aux touches directionnelles :
    
    var key = e.keyCode;
    
    if ((key == LEFT_KEY) && (!rightDirection)) { // Si le joueur appuie sur gauche ET que le serpent ne va pas à droite, il tourne.
        
        leftDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == RIGHT_KEY) && (!leftDirection)) { // Si le joueur appuie sur droite ET que le serpent ne va pas à gauche, il tourne.
        
        rightDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == UP_KEY) && (!downDirection)) { // Si le joueur appuie sur haut ET que le serpent ne va pas en bas, il tourne.
        
        upDirection = true;
        rightDirection = false;
        leftDirection = false;
    }

    if ((key == DOWN_KEY) && (!upDirection)) { // Si le joueur appuie sur bas ET que le serpent ne va pas en haut, il tourne.
        
        downDirection = true;
        rightDirection = false;
        leftDirection = false;
    }        
};    
