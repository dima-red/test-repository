export class Snake {
    SNAKE_COLOUR = 'lightgreen';
    SNAKE_BORDER_COLOUR = 'darkgreen';
    score = 0;
    changingDirection = false; 
    dx = null;
    dy = null;

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

        
    constructor(snake, ctx, dx, dy, appWrapper, numberOfplayer) {
        this.snake = snake;
        this.ctx = ctx;
        this.dx = dx;
        this.dy = dy;
        this.appWrapper = appWrapper;
        this.numberOfplayer = numberOfplayer;
    }

    advanceSnake(food, snakeBody) {
        if(snakeBody) {
            this.snake = snakeBody;
        }

        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);
        const didEatFood = this.snake[0].x === food.foodX && this.snake[0].y === food.foodY;

        if (didEatFood) {
            this.score += 10;
            this.appWrapper.querySelector(`.player-${this.numberOfplayer + 1} .score`).innerHTML = this.score;
            return true;
        } else {
            this.snake.pop();
            return false;
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
        this.ctx.lineJoin = "round";
    }

    changeDirection(ev) {
        const { keyCode } = ev;

        if (this.changingDirection) {
            return;
        }

        this.changingDirection = true;

        const goingUp = this.dy === -10;
        const goingDown = this.dy === 10;
        const goingRight = this.dx === 10;
        const goingLeft = this.dx === -10;

        if (keyCode === this.controlButtons[this.numberOfplayer].LEFT_KEY && !goingRight) {
            this.dx = -10;
            this.dy = 0;

            
        }
        if (keyCode === this.controlButtons[this.numberOfplayer].UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -10;

            
        }
        if (keyCode === this.controlButtons[this.numberOfplayer].RIGHT_KEY && !goingLeft) {
            this.dx = 10;
            this.dy = 0;

            
        }
        if (keyCode === this.controlButtons[this.numberOfplayer].DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 10;

            
        }
    }
}