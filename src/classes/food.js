import { CELL_SIZE, FOODS, FOOD_BORDER_COLOUR } from "../constants/general-constants";

export class Food {
    food = null;
    foodX = null;
    foodY = null;
    foodNumber = null;

    constructor(appWrapper, foodNumber) {
        this.appWrapper = appWrapper;
        this.canvas = this.appWrapper.querySelector("#field");
        this.ctx = this.canvas.getContext("2d");
        this.foodNumber = foodNumber;
        this.food = FOODS[this.foodNumber];
    }

    drawFood() {
        this.ctx.fillStyle = this.food.FOOD_COLOUR;
        this.ctx.strokestyle = FOOD_BORDER_COLOUR;
        this.ctx.fillRect(this.foodX, this.foodY, CELL_SIZE, CELL_SIZE);
        this.ctx.strokeRect(this.foodX, this.foodY, CELL_SIZE, CELL_SIZE);
    }

    randomTen(min, max) {
        return Math.round((Math.random() * (max-min) + min) / CELL_SIZE) * CELL_SIZE;
    }

    createFood(snakeInstances) {
        this.foodX = this.randomTen(0, this.canvas.width - CELL_SIZE);
        this.foodY = this.randomTen(0, this.canvas.height - CELL_SIZE);
        
        if (this.isFoodOnSnake(snakeInstances)) {
            this.createFood(snakeInstances);
        }
    }

    isFoodOnSnake(snakeInstances) {
        let foodIsOnsnake = null;

        snakeInstances.forEach(snakeInstance => {
            snakeInstance && snakeInstance.snake.forEach(part => {

                if (part.x === this.foodX && part.y === this.foodY) {
                    foodIsOnsnake = true;
                }
            });
        });

        return foodIsOnsnake;
    }
}