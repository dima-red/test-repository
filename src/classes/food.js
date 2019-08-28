import { CELL_SIZE } from "../constants/general-constants";

export class Food {
    FOOD_COLOUR = 'yellow';
    FOOD_BORDER_COLOUR = 'darkred';

    foodX = null;
    foodY = null;

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    drawFood() {
        this.ctx.fillStyle = this.FOOD_COLOUR;
        this.ctx.strokestyle = this.FOOD_BORDER_COLOUR;
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

        if(foodIsOnsnake) {
            return true;
        } else {
            return false;
        }
    }
}