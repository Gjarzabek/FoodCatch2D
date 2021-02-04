export class KeyInfo {
    public value: String;
    public isDown: boolean;
    public isUp: boolean;
    public press: any;
    public release: any;

    public downHandler: any;
    public upHandler: any;
    public unsubscribe: any; 

    constructor(keyValue: String) {
        this.value = keyValue;
        this.isDown = false;
        this.isUp = true;
        this.press = undefined;
        this.release = undefined;

        this.downHandler = (event: any) => {
            if (event.key === this.value) {
                if (this.isUp && this.press)
                    this.press();
                this.isDown = true;
                this.isUp = false;
                event.preventDefault();
            }
        };

        this.upHandler = (event: any) => {
            if (event.key === this.value) {
              if (this.isDown && this.release)
              this.release();
              this.isDown = false;
              this.isUp = true;
              event.preventDefault();
            }
        };


        const downListener = this.downHandler.bind(this);
        const upListener = this.upHandler.bind(this);

            
        window.addEventListener(
            "keydown", downListener, false
        );
        window.addEventListener(
            "keyup", upListener, false
        );
        
        // Detach event listeners
        this.unsubscribe = () => {
            window.removeEventListener("keydown", downListener);
            window.removeEventListener("keyup", upListener);
        };
    }
}