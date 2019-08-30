import { Food } from "./food";
import { Snake } from "./snake";
import { CONTROL_BUTTONS, GAME_SPEED, SNAKE_BODY_TEMPLATE, CANVAS_BORDER_COLOUR, CANVAS_BACKGROUND_COLOUR, FOODS } from "../constants/general-constants";

export class Game {
    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;
    foodInstances = [];
    snakeInstances = [];
    gameOverSnakesSet = new Set();
    amountOfUsers = null;
    wasFoodEatenFlag = -1;
    gameOverFlag = false;
    userScores = [
        {
            score: 0
        },
        {
            score: 0
        },
        {
            score: 0
        }
    ];

    constructor(amountOfUsers) {
        this.amountOfUsers = amountOfUsers;
        this.canvas = this.appWrapper.querySelector("#field");
        this.ctx = this.canvas.getContext("2d");
        this.createFoodInstances();
        this.createSnakeInstances();

        document.addEventListener("keydown", this.onChangeDirectionBtnClicked.bind(this));

        this.main();
        this.foodInstances.forEach(foodInstance => foodInstance.createFood(this.snakeInstances));
    }

    createFoodInstances() {
        for (let i = 0; i < FOODS.length; i++) {
            const foodNumber = i;
            this.foodInstances.push(new Food(this.canvas, this.ctx, foodNumber));
        }
    }

    createSnakeInstances() {
        for (let i = 0; i < this.amountOfUsers; i++) {
            const numberOfUser = i;
            this.snakeInstances.push(new Snake(this.ctx, CONTROL_BUTTONS[i], SNAKE_BODY_TEMPLATE, numberOfUser, this.canvas));
        }
    }

    main() {
        if (this.gameOverFlag) {
            return;
        }
        this.didGameEnd();

        setTimeout(() => {
            this.snakeInstances.forEach(snakeInstance => snakeInstance && snakeInstance.resetChangingDirectionFlag());
            this.clearCanvas();
            this.foodInstances.forEach(foodInstance => foodInstance.drawFood());

            for (let i = 0; i < this.snakeInstances.length; i++) {
                this.wasFoodEatenFlag = this.snakeInstances[i] && this.snakeInstances[i].advanceSnake(this.foodInstances);

                if (this.wasFoodEatenFlag !== null && this.wasFoodEatenFlag !== -1) {
                    const numberOfplayer = i + 1;
                    this.drawScore(numberOfplayer, this.wasFoodEatenFlag);
                    this.foodInstances[this.wasFoodEatenFlag].createFood(this.snakeInstances);
                    this.wasFoodEatenFlag = -1;
                }
            }

            this.snakeInstances.forEach(snakeInstance => snakeInstance && snakeInstance.drawSnake());
            this.main();
            

        }, GAME_SPEED);
    }

    clearCanvas() {
        this.ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
        this.ctx.strokestyle = CANVAS_BORDER_COLOUR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    onChangeDirectionBtnClicked(ev) {
        this.snakeInstances.forEach(snakeInstance => snakeInstance && snakeInstance.changeDirection(ev));
    }

    drawScore(numberOfplayer, typeOfFood) {
        if (typeOfFood <= 1) {
            this.userScores[numberOfplayer - 1].score += 10;
        } else if (typeOfFood === 2) {
            this.userScores[numberOfplayer - 1].score +=20;
        } else if (typeOfFood === 3) {
            this.userScores[numberOfplayer - 1].score -=20;
        }

        this.appWrapper
            .querySelector(`.player-${numberOfplayer} .score`)
            .innerHTML = this.userScores[numberOfplayer-1].score;
    }

    didGameEnd() {        
        this.snakeInstances.forEach(snakeInstance => {
            const collisionWithYourself = snakeInstance && snakeInstance.checkCollisionWithYourself();
            const collisionWithWall = snakeInstance && snakeInstance.checkCollisionWithWall();
            const collisionWithOtherSnake = snakeInstance && snakeInstance.checkCollisionWithOtherSnakes(this.snakeInstances);

            if (collisionWithOtherSnake >= 0 && collisionWithOtherSnake !== null) {

                console.log(collisionWithOtherSnake);
                this.gameOverSnakesSet.add(collisionWithOtherSnake);
            }

            if (collisionWithYourself && collisionWithYourself.isGameOver) {
                this.gameOverSnakesSet.add(collisionWithYourself.user);
            };

            if (collisionWithWall && collisionWithWall.isGameOver) {
                this.gameOverSnakesSet.add(collisionWithWall.user);
            }

            console.log(this.gameOverSnakesSet);
        });

        if (this.gameOverSnakesSet.size) {
            this.gameOverSnakesSet.forEach(player => {
                this.snakeInstances.splice(player, 1, null); /// TODO: remove null
                this.appWrapper
                    .querySelectorAll(".game-settings-wrapper .end-game")[player]
                    .classList.remove("hide");
            });

            this.gameOverSnakesSet.clear(); /////////

            if (!this.snakeInstances.length){
                this.gameOverFlag = true;
            }

            // if (this.gameOverSnakesSet.size === this.amountOfUsers){
            //     this.gameOverFlag = true;
            // }
        }

        console.log(this.snakeInstances);
        console.log(this.gameOverSnakesSet);
    }
}