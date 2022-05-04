let bird = function (game) {
    this.game = game;
    this.images = [];
    this.img1Loaded = false;
    this.img2Loaded = false;
    this.img3Loaded = false;
    this.loaded = false;
    this.currentImage = null;
    this.currentFrame = 0;

    sefl = this;

    this.init = function () {
        this.loadImages();
    }

    this.loadImages() = function() {
        let img1 = new Image();
        let img2 = new Image();
        let img3 = new Image();
        img1.onload = function (){
            self.img1Loaded=true;
        }
        img2.onload = function (){
            self.img2Loaded=true;
        }
        img2.onload = function (){
            self.img3Loaded=true;
        }

        // Load all images
        img1.src = 'images/bird1.png'
        img2.src = 'images/bird2.png'
        img3.src = 'images/bird3.png'

        this.images.push(img1);
        this.images.push(img2);
        this.images.push(img3);
    }


    this.update = function () {
        self.currentFrame++;
        if (self.currentFrame == 30) {
            self.currentFrame = 0;
        }

        if (self.currentFrame == 9) {
            self.currentImage = self.image[0]
        }
        else if (self.currentFrame == 19) {
            self.currentImage = self.image[1]
        }
        else if (self.currentFrame == 29) {
            self.currentImage = self.image[2]
        }
    }
    this.draw = function () {
        if (this.img1Loaded && this.img2Loaded && this.img3Loaded) {
            self.game.context.drawImage(self.currentImages, 100, 100)
        }
    }
}