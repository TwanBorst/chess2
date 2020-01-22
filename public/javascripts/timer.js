export class Timer {
    constructor() {
        this.minutes = 5;
        this.seconds = 0;
        this.running = false;
        this.interval = null;
        this.element = $('<span></span>');
        this.element.text(this.minutes + ":" + this.seconds);
    }
    start() {
        if (!this.running) {
            this.running = true;
            this.interval = setInterval(() => { this.updateTime.apply(this); }, 1000);
        }
    }
    stop() {
        if (this.running) {
            this.running = false;
            clearInterval(this.interval);
        }
    }
    updateTime() {
        if (this.seconds == 0) {
            if (this.minutes > 0) {
                this.seconds = 60;
                this.minutes--;
            } else {
                this.stop();
                // @ts-ignore
                if (this == window.player.timer) {
                    //@ts-ignore
                    window.server.send(JSON.stringify({ type: "timer", data: window.player.playerNumber }));
                    //@ts-ignore
                    window.player.playerDead();
                }
            }
        } else {
            this.seconds--;
        }
        this.element.text(this.minutes + ":" + this.seconds);
    }
}