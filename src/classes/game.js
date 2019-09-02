import { Food } from "./food";
import { Snake } from "./snake";
import { Bot } from "./bot";
import { GAME_SPEED, CANVAS_BORDER_COLOUR, CANVAS_BACKGROUND_COLOUR, FOODS } from "../constants/general-constants";

export class Game {
    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;
    foodInstances = [];
    snakeInstances = [];
    botInstances = [];
    gameOverSnakesSet = new Set();
    amountOfUsers = null;
    numberOfUser = 0;
    numberOfBot = 0;
    wasFoodEatenFlag = -1;
    gameOverFlag = false;

    constructor(amountOfUsers, amountOfBots) {
        this.amountOfUsers = amountOfUsers;
        this.amountOfBots = amountOfBots;
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
            this.foodInstances.push(new Food(this.appWrapper, foodNumber));
        }
    }

    createSnakeInstances() {
        for (let i = 0; i < this.amountOfUsers; i++) {
            this.snakeInstances.push(new Snake(this.numberOfUser, this.appWrapper));
            this.numberOfUser ++;

            if(this.amountOfBots) {
                for (let i = 0; i < this.amountOfBots; i++) {
                    this.botInstances.push(new Bot(this.numberOfBot, this.appWrapper));
                    this.numberOfBot ++;
                }
            }
        }

        console.log(this.botInstances);
        console.log(this.snakeInstances);
    }

    main() {
        if (this.gameOverFlag) {
            return;
        }
        this.didGameEnd();

        setTimeout(() => {
            this.snakeInstances.forEach(snakeInstance => snakeInstance && snakeInstance.resetChangingDirectionFlag());
            this.botInstances.forEach(botInstance => botInstance && botInstance.resetChangingDirectionFlag()); /////
            this.clearCanvas();
            this.foodInstances.forEach(foodInstance => foodInstance.drawFood());

            for (let i = 0; i < this.snakeInstances.length; i++) {
                this.wasFoodEatenFlag = this.snakeInstances[i] && this.snakeInstances[i].advanceSnake(this.foodInstances);

                if (this.wasFoodEatenFlag !== null && this.wasFoodEatenFlag !== -1) {
                    this.drawScore(this.snakeInstances[i].snakeScore, this.snakeInstances[i].numberOfUser);
                    this.foodInstances[this.wasFoodEatenFlag].createFood(this.snakeInstances);
                    this.wasFoodEatenFlag = -1;
                }
            }
            //////////
            for (let i = 0; i < this.botInstances.length; i++) {
                this.wasFoodEatenFlag = this.botInstances[i] && this.botInstances[i].advanceSnake(this.foodInstances);

                if (this.wasFoodEatenFlag !== null && this.wasFoodEatenFlag !== -1) {
                    // this.drawScore(this.snakeInstances[i].snakeScore, this.snakeInstances[i].numberOfUser);
                    this.foodInstances[this.wasFoodEatenFlag].createFood(this.botInstances);
                    this.wasFoodEatenFlag = -1;
                }
            }
            //////

            this.snakeInstances.forEach(snakeInstance => snakeInstance && snakeInstance.drawSnake());
            this.botInstances.forEach(botInstance => botInstance && botInstance.drawSnake()); ///////
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

    didGameEnd() {
        this.snakeInstances.forEach(snakeInstance => {
            const collisionWithYourself = snakeInstance && snakeInstance.checkCollisionWithYourself();
            const collisionWithWall = snakeInstance && snakeInstance.checkCollisionWithWall();
            const collisionWithOtherSnake = snakeInstance && snakeInstance.checkCollisionWithOtherSnakes(this.snakeInstances);

            if (collisionWithOtherSnake >= 0 && collisionWithOtherSnake !== null) {
                this.gameOverSnakesSet.add(collisionWithOtherSnake);
            }

            if (collisionWithYourself && collisionWithYourself.isGameOver) {
                this.gameOverSnakesSet.add(collisionWithYourself.user);
            };

            if (collisionWithWall && collisionWithWall.isGameOver) {
                this.gameOverSnakesSet.add(collisionWithWall.user);
            }
        });
        
        if (this.gameOverSnakesSet.size) {
            this.gameOverSnakesSet.forEach(player => {
                const gameOverSnake = this.snakeInstances.filter(snake => snake.numberOfUser === player);
                
                this.snakeInstances.splice(this.snakeInstances.indexOf(...gameOverSnake), 1);
                this.appWrapper
                    .querySelectorAll(".game-settings-wrapper .end-game")[player]
                    .classList.remove("hide");
            });

            this.gameOverSnakesSet.clear();

            if (!this.snakeInstances.length){
                this.gameOverFlag = true;
            }
        }
    }

    drawScore(score, numberOfUser) {
        this.appWrapper
            .querySelector(`.player-${numberOfUser + 1} .score`)
            .innerHTML = score;
    }
}