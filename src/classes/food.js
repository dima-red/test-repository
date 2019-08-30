import { CELL_SIZE, FOODS, FOOD_BORDER_COLOUR } from "../constants/general-constants";

export class Food {
    foodX = null;
    foodY = null;
    foodNumber = null;

    constructor(canvas, ctx, foodNumber) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.foodNumber = foodNumber;
    }

    drawFood() {
        this.ctx.fillStyle = FOODS[this.foodNumber].FOOD_COLOUR;
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
        
        if(this.isFoodOnSnake(snakeInstances)) {
            this.createFood(snakeInstances);
        }
    }

    isFoodOnSnake(snakeInstances) {
        let foodIsOnsnake = null;

        snakeInstances.forEach(snakeInstance => {
            snakeInstance && snakeInstance.snake.forEach(part => {

                if(part.x === this.foodX && part.y === this.foodY) {
                    foodIsOnsnake = true;
                }
            });
        });

        return foodIsOnsnake;
    }
}