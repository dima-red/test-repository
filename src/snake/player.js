export class Player {
    GAME_SPEED = 100;
    CANVAS_BORDER_COLOUR = 'black';
    CANVAS_BACKGROUND_COLOUR = "#92BE05";
    SNAKE_COLOUR = 'lightgreen';
    SNAKE_BORDER_COLOUR = 'darkgreen';
    FOOD_COLOUR = 'yellow';
    FOOD_BORDER_COLOUR = 'darkred';

    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;

    snake = [
        {x: 50, y: 580},
        {x: 40, y: 580},
        {x: 30, y: 580},
        {x: 20, y: 580},
        {x: 10, y: 580}
    ];

    score = 0;
    changingDirection = false;
    foodX = null;
    foodY = null;
    dx = 10;
    dy = 0;

    constructor(str) {
        console.log(str);
        this.canvas = this.appWrapper.querySelector("#field");
        this.ctx = this.canvas.getContext("2d");
        document.addEventListener("keydown", this.changeDirection.bind(this));
        this.main();
        this.createFood();
    }

    main() {
        if(this.didGameEnd()) {
            return;
        }

        setTimeout(() => {
            this.changingDirection = false;
            this.clearCanvas();
            this.drawFood();
            this.advanceSnake();
            this.drawSnake();

            this.main();

        }, this.GAME_SPEED);
    }

    clearCanvas() {
        this.ctx.fillStyle = this.CANVAS_BACKGROUND_COLOUR;
        this.ctx.strokestyle = this.CANVAS_BORDER_COLOUR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFood() {
        this.ctx.fillStyle = this.FOOD_COLOUR;
        this.ctx.strokestyle = this.FOOD_BORDER_COLOUR;
        this.ctx.fillRect(this.foodX, this.foodY, 10, 10);
        this.ctx.strokeRect(this.foodX, this.foodY, 10, 10);
    }

    advanceSnake() {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);
        const didEatFood = this.snake[0].x === this.foodX && this.snake[0].y === this.foodY;

        if (didEatFood) {
            this.score += 10;
            this.appWrapper.querySelector('.score').innerHTML = this.score;
            this.createFood();
        } else {
            this.snake.pop();
      }
    }

    drawSnake() {
        this.snake.forEach(part => this.drawSnakePart(part));
    }

    drawSnakePart(snakePart) {
        this.ctx.fillStyle = this.SNAKE_COLOUR;
        this.ctx.strokestyle = this.SNAKE_BORDER_COLOUR;
        this.ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
        this.ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    didGameEnd() {
        for (let i = 4; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                return true;
            }
        }

        const hitLeftWall = this.snake[0].x < 0;
        const hitRightWall = this.snake[0].x > this.canvas.width - 10;
        const hitToptWall = this.snake[0].y < 0;
        const hitBottomWall = this.snake[0].y > this.canvas.height - 10;
        
        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
    }

    randomTen(min, max) {
        return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    createFood() {
        this.foodX = this.randomTen(0, this.canvas.width - 10);
        this.foodY = this.randomTen(0, this.canvas.height - 10);
        this.snake.forEach(part => {
            const foodIsoNsnake = part.x === this.foodX && part.y === this.foodY;
            
            if (foodIsoNsnake) {
                this.createFood();
            }
        })
    }

    changeDirection(ev) {
        const { keyCode } = ev;
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        if (this.changingDirection) {
            return;
        }

        this.changingDirection = true;
        const goingUp = this.dy === -10;
        const goingDown = this.dy === 10;
        const goingRight = this.dx === 10;
        const goingLeft = this.dx === -10;

        if (keyCode === LEFT_KEY && !goingRight) {
            this.dx = -10;
            this.dy = 0;
        }
        if (keyCode === UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -10;
        }
        if (keyCode === RIGHT_KEY && !goingLeft) {
            this.dx = 10;
            this.dy = 0;
        }
        if (keyCode === DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 10;
        }
    }
}