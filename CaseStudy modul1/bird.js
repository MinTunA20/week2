let bird = function (game) {
    this.game = game;
    this.images = [];
    this.img1Loaded = false;
    this.img2Loaded = false;
    this.img3Loaded = false;
    this.loaded = false;
    this.currentImage = null;
    this.currentFrame = 0;
    this.currentImageIndex = 0;

    this.y = 0;
    this.acceleration = 0.5;

    self = this;

    this.init = function () {
        this.loadImages();
    }

    this.loadImages = function () {
        let img1 = new Image();
        let img2 = new Image();
        let img3 = new Image();
        img1.onload = function () {
            self.img1Loaded = true;
            self.currentImage = img1;
            self.images.push(img1);
        }
        img2.onload = function () {
            self.img1Loaded = true;
            self.currentImage = img2;
            self.images.push(img2);
        }
        img3.onload = function () {
            self.img1Loaded = true;
            self.currentImage = img3;
            self.images.push(img3);
        }

        // Load all images
        img1.src = 'bird1.png'
        img2.src = 'bird2.png'
        img3.src = 'bird3.png'
    }


    this.update = function () {
        if (!self.img1Loaded || !self.img2Loaded ||
            !self.img3Loaded) {
            return;
        }
        self.currentFrame++;
        if (self.currentFrame / 5 == 0) {
            self.changeImage();
        }

        //forget all stuff above
        this.speedY += this.acceleration;
        this.y += this.speedY;
    }

    this.changeImage = function () {
        if (this.currentImageIndex == 2) {
            this.currentImageIndex = 0
        } else {
            this.currentImageIndex++;
        }
        this.currentImage = this.images[this.currentImageIndex];
    }

    this.draw = function () {
        if (this.img1Loaded && this.img2Loaded && this.img3Loaded) {
            self.game.context.drawImage(self.currentImages, 100, this.y)
        }
    }
}
