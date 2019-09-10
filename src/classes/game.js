import { Food } from "./food";
import { Snake } from "./snake";
import { Bot } from "./bot";
import { GAME_SPEED, CANVAS_BORDER_COLOUR, CANVAS_BACKGROUND_COLOUR, FOODS } from "../constants/general-constants";

const appWrapper = document.querySelector(".app-wrapper");
let canvas = null;
let ctx = null;
const foodInstances = [];
const snakeInstances = [];
const gameOverSnakesSet = new Set();
let amountOfUsers = null;
let numberOfUser = 0;
let gameOverFlag = false;
let amountOfBots = null;
let onGameOver = null;

const createFoodInstances = () => {
    for (let i = 0; i < FOODS.length; i++) {
        const foodNumber = i;
        foodInstances.push(new Food(appWrapper, foodNumber));
    }
}

const createSnakeInstances = () => {
    for (let i = 0; i < amountOfUsers; i++) {
        snakeInstances.push(new Snake(numberOfUser, appWrapper));
        numberOfUser ++;
    }

    if (amountOfBots) {
        for (let j = 0; j < amountOfBots; j++) {
            snakeInstances.push(new Bot(numberOfUser, appWrapper));
            numberOfUser ++;
        }
    }

    console.info(snakeInstances);
}

const main = () => {
    if (gameOverFlag) {
        onGameOver();
        return;
    }
    didGameEnd();

    setTimeout(() => {
        clearCanvas();
        foodInstances.forEach(foodInstance => foodInstance.drawFood());
        snakeInstances.forEach(snakeInstance => {
            if (snakeInstance) {
                snakeInstance.resetChangingDirectionFlag();
                snakeInstance.advanceSnake(foodInstances);
                if (snakeInstance.botChangeDirection) {
                    snakeInstance.botChangeDirection();
                }
                snakeInstance.drawSnake();
            }
        });
        main();
        

    }, GAME_SPEED);
}

const clearCanvas = () => {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

const onChangeDirectionBtnClicked = (ev) => {
    snakeInstances.forEach(snakeInstance => {
        if (snakeInstance && snakeInstance.isItRealUser) {
            snakeInstance.changeDirection(ev);
        }
    });
}

const didGameEnd = () => {
    snakeInstances.forEach(snakeInstance => {
        const collisionWithYourself = snakeInstance && snakeInstance.checkCollisionWithYourself();
        const collisionWithWall = snakeInstance && snakeInstance.checkCollisionWithWall();
        const collisionWithOtherSnake = snakeInstance && snakeInstance.checkCollisionWithOtherSnakes(snakeInstances);

        if (collisionWithOtherSnake >= 0 && collisionWithOtherSnake !== null) {
            gameOverSnakesSet.add(collisionWithOtherSnake);
        }

        if (collisionWithYourself && collisionWithYourself.isGameOver) {
            gameOverSnakesSet.add(collisionWithYourself.user);
        };

        if (collisionWithWall && collisionWithWall.isGameOver) {
            gameOverSnakesSet.add(collisionWithWall.user);
        }
    });
    
    if (gameOverSnakesSet.size) {
        gameOverSnakesSet.forEach(player => {
            const gameOverSnake = snakeInstances.filter(snake => snake.numberOfUser === player);
            
            snakeInstances.splice(snakeInstances.indexOf(...gameOverSnake), 1);
            showGameOver(player);
        });
        gameOverSnakesSet.clear();

        if (!snakeInstances.length){
            gameOverFlag = true;
        }
    }
}

const showGameOver = (player) => {
    appWrapper
        .querySelectorAll(".game-settings-wrapper .end-game")[player]
        .classList.remove("hide");
}


export class Game {
    constructor(usersAmount, botsAmount, gameOverCB) {
        onGameOver = gameOverCB;
        amountOfUsers = usersAmount;
        amountOfBots = botsAmount;
        canvas = appWrapper.querySelector("#field");
        ctx = canvas.getContext("2d");
        createFoodInstances();
        createSnakeInstances();

        document.addEventListener("keydown", onChangeDirectionBtnClicked);

        main();
        foodInstances.forEach(foodInstance => foodInstance.createFood(snakeInstances));
    }
}