export class Snake {
    SNAKE_COLOUR = 'lightgreen';
    SNAKE_BORDER_COLOUR = 'darkgreen';
    changingDirection = false; 
    dx = null;
    dy = null;
    snake = null;

    constructor(ctx, dx, dy, controls, snakeBodyTemplate, numberOfUser, canvas) {
        this.ctx = ctx;
        this.dx = dx;
        this.dy = dy;
        this.controls = controls;
        this.numberOfUser = numberOfUser;
        this.canvas = canvas;
        this.snake = this.generateSnake(snakeBodyTemplate, numberOfUser);
    }

    generateSnake(snakeTemplate, numberOfUser) {
        const snake = snakeTemplate.map(part => {
            return {
                x: part.x,
                y: part.y - 50 * numberOfUser
            }
        });

        return snake;
    }

    advanceSnake(food) {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);
        const didEatFood = this.snake[0].x === food.foodX && this.snake[0].y === food.foodY;

        if (didEatFood) {
            
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

        if (keyCode === this.controls.LEFT_KEY && !goingRight) {
            this.dx = -10;
            this.dy = 0;
        }

        if (keyCode === this.controls.UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -10;
        }

        if (keyCode === this.controls.RIGHT_KEY && !goingLeft) {
            this.dx = 10;
            this.dy = 0;  
        }

        if (keyCode === this.controls.DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 10;  
        }
    }

    getSnakeState() {
        for(let i = 4; i < this.snake.length; i++) {
            if(this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                return {
                    user: this.numberOfUser,
                    isGameOver: true
                };
            }
        }

        const hitLeftWall = this.snake[0].x < 0;
        const hitRightWall = this.snake[0].x > this.canvas.width - 10;
        const hitToptWall = this.snake[0].y < 0;
        const hitBottomWall = this.snake[0].y > this.canvas.height - 10;

        return {
            user: this.numberOfUser,
            isGameOver: hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
        }
    }
}