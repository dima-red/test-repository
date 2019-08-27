import { Food } from "./food";
import { Snake } from "./snake";

export class Game {
    GAME_SPEED = 100;
    CANVAS_BORDER_COLOUR = 'black';
    CANVAS_BACKGROUND_COLOUR = "#92BE05";
    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;
    food = null;
    snakeInstances = [];
    amountOfUsers = null;

    snakeBodyTemplate = [
        {x: 50, y: 580},
        {x: 40, y: 580},
        {x: 30, y: 580},
        {x: 20, y: 580},
        {x: 10, y: 580}
    ];
    controlButtons = [
        {
            LEFT_KEY: 37,
            RIGHT_KEY: 39,
            UP_KEY: 38,
            DOWN_KEY: 40,
        },
        {
            LEFT_KEY: 65,
            RIGHT_KEY: 68,
            UP_KEY: 87,
            DOWN_KEY: 83,
        },
        {
            LEFT_KEY: 74,
            RIGHT_KEY: 76,
            UP_KEY: 73,
            DOWN_KEY: 75,
        },
    ];
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
            this.snakeInstances.push(new Snake(this.ctx, this.dx, this.dy, this.controlButtons[i], this.snakeBodyTemplate, numberOfUser, this.canvas));
        }
    }

    main() {
        if(this.gameOverFlag) {
            return;
        }
        this.didGameEnd();

        setTimeout(() => {
            this.snakeInstances.forEach(snakeInstance => snakeInstance.changingDirection = false);
            this.clearCanvas();
            this.food.drawFood();

            for(let i = 0; i < this.snakeInstances.length; i++) {
                this.wasFoodEatenFlag = this.snakeInstances[i].advanceSnake(this.food);

                if(this.wasFoodEatenFlag) {
                    const numberOfplayer = i+1;
                    this.userScores[i].score += 10;
                    this.drawScore(this.userScores[i].score, numberOfplayer);
                    this.food.createFood(this.snakeInstances);
                    this.wasFoodEatenFlag = false;
                }
            }

            this.snakeInstances.forEach(snakeInstance => snakeInstance.drawSnake());
            this.main();
            

        }, this.GAME_SPEED);
    }

    clearCanvas() {
        this.ctx.fillStyle = this.CANVAS_BACKGROUND_COLOUR;
        this.ctx.strokestyle = this.CANVAS_BORDER_COLOUR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    didGameEnd() {
        const snakeStates = [];
        
        this.snakeInstances.forEach(snakeInstance => {
            const snakeState = snakeInstance.getSnakeState();

            if(snakeState.isGameOver) {
                snakeStates.push(snakeState.user);
            }
        });

        if(snakeStates.length) {
            snakeStates.forEach(player => this.appWrapper
                .querySelectorAll(".game-settings-wrapper .end-game")[player]
                .classList.remove("hide"));
            if(snakeStates.length === this.snakeInstances.length){
                this.gameOverFlag = true;
            }
        }
    }

    onChangeDirectionBtnClicked(ev) {
        for(let i = 0; i < this.snakeInstances.length; i++) {
            this.snakeInstances[i].changeDirection(ev);
        }
    }

    drawScore(score, numberOfplayer) {
        this.appWrapper
            .querySelector(`.player-${numberOfplayer} .score`)
            .innerHTML = score;
    }
}