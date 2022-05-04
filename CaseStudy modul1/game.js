    let game = function() {
    this.canvas = null;
    this.context = null;
    this.width = 288;
    this.height = 512;

    this.bird=null;
    this.bg = null;

    let self = this;

    this.init = function(){
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        document.body.appendChild(this.canvas);

        // create new bird
        this.bird = new bird(this);
        this.bird.init();
        // create background
        this.bg = new bg(this)
        this.bg.init();
        this.loop()
    }

    this.loop =function() {
        this.update();
        this.draw();
        console.log('loop')

        setTimeout(self.loop,33)
    }

    this.update =function(){
        this.bird.update();
        this.bg.update();
    }
    this.draw = function (){
        this.bg.draw();
        this.bird.draw();

    }
}

let g = new game();
g.init();