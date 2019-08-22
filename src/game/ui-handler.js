import { Player } from "./player";

export class UIHandler {
    modalsWrapper = document.querySelector(".modals-wrapper");
    multiFlag = false;

    constructor() {
        this.modalsWrapper.querySelector(".single-player").addEventListener("click", this.onSinglePlayerBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".multiplayer").addEventListener("click", this.onMultiplayerBtnClicked.bind(this));
        Array.from(this.modalsWrapper.querySelectorAll(".back-btn")).forEach(node => node.addEventListener("click", this.onBachBtnClicked.bind(this)));
        this.modalsWrapper.querySelector(".without-bots").addEventListener("click", this.onWithoutBotsBtnClicked.bind(this));

    }

    onWithoutBotsBtnClicked() {
        this.modalsWrapper
            .querySelector(".single-settings")
            .classList.remove("show-modal");
    }

    onSinglePlayerBtnClicked() {
        this.multiFlag = false;
        this.modalsWrapper
            .querySelector(".initial-state")
            .classList.remove("show-modal");

        this.modalsWrapper
            .querySelector(".single-settings")
            .classList.add("show-modal");
    }

    onMultiplayerBtnClicked() {
        this.multiFlag = true;
        this.modalsWrapper
            .querySelector(".initial-state")
            .classList.remove("show-modal");

        this.modalsWrapper
            .querySelector(".multi-settings")
            .classList.add("show-modal");
    }

    onBachBtnClicked() {
        if(this.multiFlag) {
            this.modalsWrapper
                .querySelector(".multi-settings")
                .classList.remove("show-modal");

            this.modalsWrapper
                .querySelector(".initial-state")
                .classList.add("show-modal");
        } else {
            this.modalsWrapper
                .querySelector(".single-settings")
                .classList.remove("show-modal");

            this.modalsWrapper
                .querySelector(".initial-state")
                .classList.add("show-modal");
        }
    }
}