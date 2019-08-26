import { Game } from "./game";

export class UIHandler {
    WITH_ONE_USER = 2;
    WITH_TWO_USERS = 3;
    WITHOUT_BOTS = 1;
    modalsWrapper = document.querySelector(".modals-wrapper");
    appWrapper = document.querySelector(".app-wrapper");
    multiFlag = false;

    constructor() {
        this.modalsWrapper.querySelector(".single-player").addEventListener("click", this.onSinglePlayerBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".multiplayer").addEventListener("click", this.onMultiplayerBtnClicked.bind(this));
        Array.from(this.modalsWrapper.querySelectorAll(".back-btn")).forEach(node => node.addEventListener("click", this.onBackBtnClicked.bind(this)));
        this.modalsWrapper.querySelector(".without-bots").addEventListener("click", this.onWithoutBotsBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".with-one-user").addEventListener("click", this.onWithOneUserBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".with-two-users").addEventListener("click", this.onWithTwoUsersBtnClicked.bind(this));

        this.appWrapper.querySelector(".game-settings-wrapper").style.removeProperty("display"); // TO ASK: ask about it
    }

    removeModalClass(parent, selector) {
        this.modalsWrapper
            .querySelector(parent)
            .classList.remove(selector);
    }

    addModalClass(parent, selector) {
        this.modalsWrapper
            .querySelector(parent)
            .classList.add(selector);
    }

    removeAppClass(parent, selector) {
        if(parent) {
            this.appWrapper
                .querySelector(parent)
                .classList.remove(selector)
        } else {
            this.appWrapper
                .classList.remove(selector)
        }
        
    }

    onWithOneUserBtnClicked() {        
        this.removeModalClass(".multi-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        this.removeAppClass(".game-settings-wrapper .player-2", "hide");
        
        
        new Game(this.WITH_ONE_USER);
    }

    onWithTwoUsersBtnClicked() {
        this.removeModalClass(".multi-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        this.removeAppClass(".game-settings-wrapper .player-2", "hide");
        this.removeAppClass(".game-settings-wrapper .player-3", "hide");
        
        new Game(this.WITH_TWO_USERS);
    }

    onWithoutBotsBtnClicked() {
        this.removeModalClass(".single-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        
        new Game(this.WITHOUT_BOTS);
    }

    onSinglePlayerBtnClicked() {
        this.multiFlag = false;
        this.removeModalClass(".initial-state", "show-modal");
        this.addModalClass(".single-settings", "show-modal");
    }

    onMultiplayerBtnClicked() {
        this.multiFlag = true;
        this.removeModalClass(".initial-state", "show-modal");
        this.addModalClass(".multi-settings", "show-modal");
    }

    onBackBtnClicked() {
        if(this.multiFlag) {
            this.removeModalClass(".multi-settings", "show-modal");
            this.addModalClass(".initial-state", "show-modal");
        } else {
            this.removeModalClass(".single-settings", "show-modal");
            this.addModalClass(".initial-state", "show-modal");
        }
    }
}