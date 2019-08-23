export class Snake {
    SNAKE_COLOUR = 'lightgreen';
    SNAKE_BORDER_COLOUR = 'darkgreen';
    score = 0;
    changingDirection = false; 
    dx = null;
    dy = null;

        
    constructor(snake, ctx, dx, dy, appWrapper) {
        this.snake = snake;
        this.ctx = ctx;
        this.dx = dx;
        this.dy = dy;
        this.appWrapper = appWrapper;
    }

    advanceSnake(delta, foodDelta, snakeBody) {
        if(delta) {
            this.dx = delta.x;
            this.dy = delta.y;
        }

        if(foodDelta) {
            this.foodX = foodDelta.foodX;
            this.foodY = foodDelta.foodY;
        }

        if(snakeBody) {
            this.snake = snakeBody;
        }

        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);
        const didEatFood = this.snake[0].x === this.foodX && this.snake[0].y === this.foodY;

        if (didEatFood) {
            this.score += 10;
            this.appWrapper.querySelector('.score').innerHTML = this.score;
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

            return {x: this.dx, y: this.dy};
        }
        if (keyCode === UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -10;

            return {x: this.dx, y: this.dy};
        }
        if (keyCode === RIGHT_KEY && !goingLeft) {
            this.dx = 10;
            this.dy = 0;

            return {x: this.dx, y: this.dy};
        }
        if (keyCode === DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 10;

            return {x: this.dx, y: this.dy};
        }
    }
}