import { UIHandler } from "./ui-handler";
import { Player } from "./player";
import { Food } from "./food";

class Game {    
    GAME_SPEED = 100;
    CANVAS_BORDER_COLOUR = 'black';
    CANVAS_BACKGROUND_COLOUR = "#92BE05";
    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;
    score = 0;
    snake1 = [
        {x: 50, y: 580},
        {x: 40, y: 580},
        {x: 30, y: 580},
        {x: 20, y: 580},
        {x: 10, y: 580}
    ];
    snake2 = [
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

        this.food = new Food(this.canvas, this.ctx, this.snake1, this.snake2),

        this.player1 = new Player(this.snake1, this.ctx, this.dx, this.dy);
        this.player2 = new Player(this.snake2, this.ctx, this.dx, this.dy);
        

        this.main();
        this.food.createFood();
    }

    main() {
        if(this.didGameEnd()) {
            return;
        }

        setTimeout(() => {
            this.player1.changingDirection = false;
            this.player2.changingDirection = false;
            this.clearCanvas();
            this.food.drawFood();
            this.player1.snakeInstance.advanceSnake();
            this.player1.snakeInstance.drawSnake();
            this.player2.snakeInstance.advanceSnake();
            this.player2.snakeInstance.drawSnake();

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
        for (let i = 4; i < this.snake1.length; i++) {
            if (this.snake1[i].x === this.snake1[0].x && this.snake1[i].y === this.snake1[0].y) {
                return true;
            }
        }

        for (let i = 4; i < this.snake2.length; i++) {
            if (this.snake2[i].x === this.snake2[0].x && this.snake2[i].y === this.snake2[0].y) {
                return true;
            }
        }

        const hitLeftWall = this.snake1[0].x < 0 || this.snake2[0].x < 0;
        const hitRightWall = this.snake1[0].x > this.canvas.width - 10 || this.snake2[0].x > this.canvas.width - 10;
        const hitToptWall = this.snake1[0].y < 0 || this.snake2[0].y < 0;
        const hitBottomWall = this.snake1[0].y > this.canvas.height - 10 || this.snake1[0].y > this.canvas.height - 10;
        
        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
    }
}

document.addEventListener('DOMContentLoaded', () => new Game());