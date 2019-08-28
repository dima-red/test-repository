import { Food } from "./food";
import { Snake } from "./snake";
import { CONTROL_BUTTONS, GAME_SPEED, SNAKE_BODY_TEMPLATE, CANVAS_BORDER_COLOUR, CANVAS_BACKGROUND_COLOUR } from "../constants/general-constants";

export class Game {
    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;
    food = null;
    snakeInstances = [];
    gameOverSnakesSet = new Set();
    amountOfUsers = null;
    dx = 10;
    dy = 0;
    wasFoodEatenFlag = false;
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
        this.food = new Food(this.canvas, this.ctx),
        this.createSnakeInstances();

        document.addEventListener("keydown", this.onChangeDirectionBtnClicked.bind(this));

        this.main();
        this.food.createFood(this.snakeInstances);
    }    

    createSnakeInstances() {
        for(let i = 0; i < this.amountOfUsers; i++) {
            const numberOfUser = i;
            this.snakeInstances.push(new Snake(this.ctx, this.dx, this.dy, CONTROL_BUTTONS[i], SNAKE_BODY_TEMPLATE, numberOfUser, this.canvas));
        }
    }

    main() {
        if(this.gameOverFlag) {
            return;
        }
        this.didGameEnd();

        setTimeout(() => {
            this.snakeInstances.forEach(snakeInstance => snakeInstance && snakeInstance.resetChangingDirectionFlag());
            this.clearCanvas();
            this.food.drawFood();

            for(let i = 0; i < this.snakeInstances.length; i++) {
                this.wasFoodEatenFlag = this.snakeInstances[i] && this.snakeInstances[i].advanceSnake(this.food);

                if(this.wasFoodEatenFlag) {
                    const numberOfplayer = i+1;
                    this.userScores[i].score += 10;
                    this.drawScore(this.userScores[i].score, numberOfplayer);
                    this.food.createFood(this.snakeInstances);
                    this.wasFoodEatenFlag = false;
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

    drawScore(score, numberOfplayer) {
        this.appWrapper
            .querySelector(`.player-${numberOfplayer} .score`)
            .innerHTML = score;
    }

    didGameEnd() {
        this.checkCollisionWithOtherSnakes();
        
        this.snakeInstances.forEach(snakeInstance => {
            const collisionWithYourself = snakeInstance && snakeInstance.checkCollisionWithYourself();
            const collisionWithWall = snakeInstance && snakeInstance.checkCollisionWithWall();

            if(collisionWithYourself && collisionWithYourself.isGameOver) {
                this.gameOverSnakesSet.add(collisionWithYourself.user);
            };

            if(collisionWithWall && collisionWithWall.isGameOver) {
                this.gameOverSnakesSet.add(collisionWithWall.user);
            }
        });

        if(this.gameOverSnakesSet.size) {
            const arr = [];
            this.gameOverSnakesSet.forEach(el => arr.push(el));

            console.log(this.snakeInstances);
            console.log(this.gameOverSnakesSet);

            this.gameOverSnakesSet.forEach(player => {
                this.snakeInstances.splice(player, 1, null);
                this.appWrapper
                    .querySelectorAll(".game-settings-wrapper .end-game")[player]
                    .classList.remove("hide");
            });

            console.log(this.snakeInstances);
            console.log(this.gameOverSnakesSet);

            if(this.gameOverSnakesSet.size === this.amountOfUsers){
                this.gameOverFlag = true;
            }
        }
    }

    checkCollisionWithOtherSnakes() {
        const allSnakes = [];

        this.snakeInstances.forEach(snakeInstance => snakeInstance && allSnakes.push(snakeInstance.snake));

        allSnakes.forEach((snake1, allSnakesIndex1) => {
            allSnakes.forEach((snake2, allSnakesIndex2) => {
                snake1.forEach(snake1Part => {
                    if(snake1Part.x === snake2[0].x && snake1Part.y === snake2[0].y && allSnakesIndex1 !== allSnakesIndex2) {
                        this.gameOverSnakesSet.add(allSnakes.indexOf(snake2));
                    }
                });
            });
        });
    }
}