import { Snake } from "./snake";
import { BOT_MIN_CONTROL_KEY, BOT_MAX_CONTROL_KEY, BOT_CONTROL_BUTTONS } from "../constants/general-constants";

export class Bot extends Snake {
    numberOfUser = null;
    appWrapper = null;

    constructor(numberOfUser, appWrapper) {
        super(numberOfUser, appWrapper);

        this.numberOfUser = numberOfUser;
        this.appWrapper = appWrapper;
        this.controls = BOT_CONTROL_BUTTONS[this.numberOfUser];
    }

    getBotKeyCode() {
        const botKeyCode = Math.round((Math.random() * (BOT_MAX_CONTROL_KEY - BOT_MIN_CONTROL_KEY) + BOT_MIN_CONTROL_KEY));
        
        return botKeyCode;
    }

    isDirectionChanged() {
        const isDirectionChanged = Math.round((Math.random() * (10 - 0) + 0));

        return isDirectionChanged >= 5;
    }

}