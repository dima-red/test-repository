import { USER_CONTROL_BUTTONS, SNAKE_BODY_TEMPLATE, CELL_SIZE, SNAKE_OFFSET, SNAKE_COLOURS, SNAKE_BORDER_COLOUR } from "../constants/general-constants";

export class Snake {
    changingDirectionFlag = false; 
    dx = 10;
    dy = 0;
    snake = null;
    numberOfUser = null;
    snakeScore = null;
    isItRealUser = true;

    constructor(numberOfUser, appWrapper) {
        this.numberOfUser = numberOfUser;
        this.controls = USER_CONTROL_BUTTONS[this.numberOfUser];
        this.appWrapper = appWrapper;
        this.canvas = this.appWrapper.querySelector("#field");
        this.ctx = this.canvas.getContext("2d");
        this.snake = this.generateSnake(SNAKE_BODY_TEMPLATE, this.numberOfUser);
    }

    generateSnake(snakeTemplate, userNumber) {
        const snake = snakeTemplate.map(part => {
            return {
                x: part.x,
                y: part.y - SNAKE_OFFSET * userNumber
            }
        });

        return snake;
    }

    advanceSnake(foods) {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);

        const didEatFoodArr = foods.filter(food => (this.snake[0].x === food.foodX && this.snake[0].y === food.foodY));

        if (didEatFoodArr.length) {
            this.snakeScore += didEatFoodArr[0].food.FOOD_COST;
            this.drawScore();
            foods[didEatFoodArr[0].foodNumber].createFood([this]);
        } else {
            this.snake.pop();

            return -1;
        }
    }

    drawSnake() {
        this.snake.forEach(part => this.drawSnakePart(part));
    }

    drawSnakePart(snakePart) {
        this.ctx.fillStyle = SNAKE_COLOURS[this.numberOfUser].COLOUR;
        this.ctx.strokestyle = SNAKE_BORDER_COLOUR;
        this.ctx.fillRect(snakePart.x, snakePart.y, CELL_SIZE, CELL_SIZE);
        this.ctx.strokeRect(snakePart.x, snakePart.y, CELL_SIZE, CELL_SIZE);
        this.ctx.lineJoin = "round";
    }

    changeDirection(ev) {
        const { keyCode } = ev;

        if (this.changingDirectionFlag) {
            return;
        }

        this.changingDirectionFlag = true;

        const goingUp = this.dy === -CELL_SIZE;
        const goingDown = this.dy === CELL_SIZE;
        const goingRight = this.dx === CELL_SIZE;
        const goingLeft = this.dx === -CELL_SIZE;

        if (keyCode === this.controls.LEFT_KEY && !goingRight) {
            this.dx = -CELL_SIZE;
            this.dy = 0;
        }

        if (keyCode === this.controls.UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -CELL_SIZE;
        }

        if (keyCode === this.controls.RIGHT_KEY && !goingLeft) {
            this.dx = CELL_SIZE;
            this.dy = 0;  
        }

        if (keyCode === this.controls.DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = CELL_SIZE;  
        }
    }

    checkCollisionWithYourself() {
        const collisionWithYourself = {
            user: this.numberOfUser,
            isGameOver: false
        };

        for (let i = 4; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                collisionWithYourself.isGameOver = true;
            }
        }

        return collisionWithYourself;
    }

    checkCollisionWithWall() {
        const hitLeftWall = this.snake[0].x < 0;
        const hitRightWall = this.snake[0].x > this.canvas.width - CELL_SIZE;
        const hitToptWall = this.snake[0].y < 0;
        const hitBottomWall = this.snake[0].y > this.canvas.height - CELL_SIZE;

        return {
            user: this.numberOfUser,
            isGameOver: hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
        }
    }

    checkCollisionWithOtherSnakes(allSnakesInstances) {        
        const anotherSnakeInstances = allSnakesInstances.filter(snakeInstance => snakeInstance && snakeInstance.numberOfUser !== this.numberOfUser);
        let isCurrentSnakeWasCrashed = null;

        for (const anotherSnakeInstance of anotherSnakeInstances) {
            for (const anotherSnake of anotherSnakeInstance.snake) {
                if (anotherSnake.x === this.snake[0].x && anotherSnake.y === this.snake[0].y) {
                    isCurrentSnakeWasCrashed = this.numberOfUser;
                }
            }
        };

        if (isCurrentSnakeWasCrashed !== null) {
            return isCurrentSnakeWasCrashed;
        } else {

            return -1;
        }
    }

    resetChangingDirectionFlag() {
        this.changingDirectionFlag = false;
    }

    drawScore() {
        this.appWrapper
            .querySelector(`.player-${this.numberOfUser + 1} .score`)
            .innerHTML = this.snakeScore;
    }
}