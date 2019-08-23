import { UIHandler } from "./ui-handler";
import { Food } from "./food";
import { Snake } from "./snake";

export class Game{
    GAME_SPEED = 100;
    CANVAS_BORDER_COLOUR = 'black';
    CANVAS_BACKGROUND_COLOUR = "#92BE05";
    appWrapper = document.querySelector(".app-wrapper");
    canvas = null;
    ctx = null;

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

    constructor(amountOfUsers) {
        this.amountOfUsers = amountOfUsers;
        this.canvas = this.appWrapper.querySelector("#field");
        this.ctx = this.canvas.getContext("2d");

        this.snakes = this.generateSnakes(this.snakeBodyTemplate, this.amountOfUsers);

        this.food = new Food(this.canvas, this.ctx),

        this.createSnakeInstances(this.snakes);

        this.snake1 = new Snake(this.snakeBody1, this.ctx, this.dx, this.dy, this.appWrapper);
        this.snake2 = new Snake(this.snakeBody2, this.ctx, this.dx, this.dy, this.appWrapper);
        document.addEventListener("keydown", this.onChangeDirectionBtnClicked.bind(this));

        this.main();
        this.foodDelta = this.food.createFood();
        this.isFoodOnSnake();
        
        
    }

    generateSnakes(snakeTemplate, amountUsers) {
        const snakesArr = [];
        
        for (let i=0; i < amountUsers; i++) {
            snakesArr.push(snakeTemplate.map(part =>{
                return {
                    x: part.x,
                    y: part.y - 50 * i
                }
            }));
        }

        return snakesArr;
    }

    createSnakeInstances(snakes) {
        this.snakeInstances = snakes.map(snake => new Snake(snake, this.ctx, this.dx, this.dy, this.appWrapper));
    }

    main() {
        if(this.didGameEnd()) {
            return;
        }

        setTimeout(() => {
            this.snake1.changingDirection = false;
            this.snake2.changingDirection = false;
            this.clearCanvas();
            this.food.drawFood();
            this.wasFoodEatenFlag = this.snake1.advanceSnake(this.deltaSnake1, this.foodDelta, this.snakeBody1);

            if(this.wasFoodEatenFlag) {
                this.foodDelta = this.food.createFood();
                this.wasFoodEatenFlag = false;
            }
           
            this.wasFoodEatenFlag = this.snake2.advanceSnake(this.deltaSnake2, this.foodDelta, this.snakeBody2);
            
            if(this.wasFoodEatenFlag) {
                this.foodDelta = this.food.createFood();
                this.wasFoodEatenFlag = false;
            }
            this.snake1.drawSnake();
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

    onChangeDirectionBtnClicked(ev) {
        this.deltaSnake1 = this.snake1.changeDirection(ev);
        this.deltaSnake1 = this.snake2.changeDirection(ev);
    }

    isFoodOnSnake() {
        this.snakeBody1.forEach(part => {
            const foodIsOnsnake = part.x === this.foodDelta.foodX && part.y === this.foodDelta.foodX;
            
            if (foodIsOnsnake) {
                this.food.createFood();
            }
        });

        this.snakeBody2.forEach(part => {
            const foodIsOnsnake = part.x === this.foodDelta.foodX && part.y === this.foodDelta.foodX;
            
            if (foodIsOnsnake) {
                this.food.createFood();
            }
        });
    }
}