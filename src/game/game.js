import { UIHandler } from "./ui-handler";
import { Food } from "./food";
import { Snake } from "./snake";

class Game{
    GAME_SPEED = 100;
    CANVAS_BORDER_COLOUR = 'black';
    CANVAS_BACKGROUND_COLOUR = "#92BE05";
    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;
    score = 0;

    snakeBody1 = [
        {x: 50, y: 580},
        {x: 40, y: 580},
        {x: 30, y: 580},
        {x: 20, y: 580},
        {x: 10, y: 580}
    ];
    snakeBody2 = [
        {x: 50, y: 280},
        {x: 40, y: 280},
        {x: 30, y: 280},
        {x: 20, y: 280},
        {x: 10, y: 280}
    ];

    dx = 10;
    dy = 0;

    constructor(
        uiHandler = new UIHandler(),
    ) {
        this.canvas = this.appWrapper.querySelector("#field");
        this.ctx = this.canvas.getContext("2d");

        this.food = new Food(this.canvas, this.ctx, this.snakeBody1, this.snakeBody2),
        this.foodObj = this.food.createFood();
        this.snake1 = new Snake(this.canvas, this.snakeBody1, this.snakeBody2, this.ctx, this.dx, this.dy, this.foodObj, this.appWrapper);
        this.snake2 = new Snake(this.canvas, this.snakeBody2, this.snakeBody1, this.ctx, this.dx, this.dy, this.foodObj, this.appWrapper);        

        this.main();
        
    }

    main() {
        
        console.log(this.foodObj);


        if(this.didGameEnd()) {
            return;
        }

        setTimeout(() => {
            this.snake1.changingDirection = false;
            this.snake2.changingDirection = false;
            this.clearCanvas();
            this.food.drawFood();
            this.snake1.advanceSnake();
            this.snake1.drawSnake();
            this.snake2.advanceSnake();
            this.snake2.drawSnake();

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
        for (let i = 4; i < this.snakeBody1.length; i++) {
            if (this.snakeBody1[i].x === this.snakeBody1[0].x && this.snakeBody1[i].y === this.snakeBody1[0].y) {
                return true;
            }
        }

        for (let i = 4; i < this.snakeBody2.length; i++) {
            if (this.snakeBody2[i].x === this.snakeBody2[0].x && this.snakeBody2[i].y === this.snakeBody2[0].y) {
                return true;
            }
        }

        const hitLeftWall = this.snakeBody1[0].x < 0 || this.snakeBody2[0].x < 0;
        const hitRightWall = this.snakeBody1[0].x > this.canvas.width - 10 || this.snakeBody2[0].x > this.canvas.width - 10;
        const hitToptWall = this.snakeBody1[0].y < 0 || this.snakeBody2[0].y < 0;
        const hitBottomWall = this.snakeBody1[0].y > this.canvas.height - 10 || this.snakeBody1[0].y > this.canvas.height - 10;
        
        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
    }
}

document.addEventListener('DOMContentLoaded', () => new Game());