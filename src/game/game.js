import { Food } from "./food";
import { Snake } from "./snake";

export class Game{
    GAME_SPEED = 100;
    CANVAS_BORDER_COLOUR = 'black';
    CANVAS_BACKGROUND_COLOUR = "#92BE05";
    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;
    snakes = null;
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
    dx = 10;
    dy = 0;
    wasFoodEatenFlag = false;
    deltaSnake = {};
    gameOverState = [];
    gameOverFlag = false;

    constructor(amountOfUsers) {
        this.amountOfUsers = amountOfUsers;
        this.canvas = this.appWrapper.querySelector("#field");
        this.ctx = this.canvas.getContext("2d");
        this.snakes = this.generateSnakes(this.snakeBodyTemplate, this.amountOfUsers);

        this.food = new Food(this.canvas, this.ctx),
        this.createSnakeInstances(this.snakes);

        document.addEventListener("keydown", this.onChangeDirectionBtnClicked.bind(this));

        this.main();
        this.foodDelta = this.food.createFood();
        this.isFoodOnSnake();
        
        
    }

    generateSnakes(snakeTemplate, amountUsers) {
        const snakesArr = [];
        
        for (let i=0; i < amountUsers; i++) {
            snakesArr.push(snakeTemplate.map(part => {
                return {
                    x: part.x,
                    y: part.y - 50 * i
                }
            }));
        }

        return snakesArr;
    }

    createSnakeInstances(snakes) {
        for(let i = 0; i < this.amountOfUsers; i++) {
            this.snakeInstances.push(new Snake(snakes[i], this.ctx, this.dx, this.dy, this.appWrapper, i));
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
                this.wasFoodEatenFlag = this.snakeInstances[i].advanceSnake(this.deltaSnake[i], this.foodDelta, this.snakeBody1);

                if(this.wasFoodEatenFlag) {
                    this.foodDelta = this.food.createFood();
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

    getGameState() {
        const gameState = this.snakes.map(snake => {
            for(let i = 4; i < snake.length; i++) {
                if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                    return {
                        user: this.snakes.indexOf(snake),
                        isGameOver: true
                    };
                }
            }

            const hitLeftWall = snake[0].x < 0;
            const hitRightWall = snake[0].x > this.canvas.width - 10;
            const hitToptWall = snake[0].y < 0;
            const hitBottomWall = snake[0].y > this.canvas.height - 10;

            return {
                user: this.snakes.indexOf(snake),
                isGameOver: hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
            }
        });

        return gameState;
    }

    didGameEnd() {
        this.gameOverState = this.getGameState().filter(user => user.isGameOver);

        if(this.gameOverState.length) {
            this.gameOverState.forEach(player => this.appWrapper
                .querySelectorAll(".game-settings-wrapper .end-game")[player.user].classList.remove("hide"));
            if(this.gameOverState.length === this.snakes.length){
                this.gameOverFlag = true;
            }
        }
    }

    onChangeDirectionBtnClicked(ev) {
        for(let i = 0; i < this.snakeInstances.length; i++) {
            this.deltaSnake[i] = this.snakeInstances[i].changeDirection(ev);
        }
    }

    isFoodOnSnake() {
        this.snakes.forEach(snake => {
            const foodIsOnsnake = snake.x === this.foodDelta.foodX && snake.y === this.foodDelta.foodX;

            if (foodIsOnsnake) {
                this.food.createFood();
            }
        });
    }
}