function canvasMaker(parent,color1,color2) {
    var self = this;
        
    this.parent = parent;
    this.cannon = null;
    this.firing = false;
    this.cannonX = null;
    this.cannonY = null;

    this.createRectangle = function() {
        self.rect = document.createElement("div");
        self.rect.setAttribute("class", "container");
        self.rect.style.border = "4px solid " + color1;
        self.rect.addEventListener("click", function () {
            if (event.target.className == 'circle' && self.cannon!=null){
                self.deleteCannon(event);
            } else {
                if (self.cannon==null){
                    self.createCannon(event)
                }
                
            }
        })
        self.rect.addEventListener("mousedown", function () {
            if (self.cannon!=null){
                self.fireCannon(event)
            }
            
        })
        self.rect.addEventListener("mouseup", function () {
            if (self.cannon!=null){
                self.cancelShooting(event)
            }
        })
        self.parent.appendChild(self.rect);
    }

    self.createCannon = function(event) {
        if (self.parent.getElementsByClassName('circle').length==0){
            self.cannon = document.createElement("div")
            self.cannonY = event.offsetY-10;
            self.cannonX = event.offsetX-10;
            self.cannon.style.top = self.cannonY + 'px';
            self.cannon.style.left = self.cannonX + 'px';
            self.cannon.style.background = color2;
            self.cannon.setAttribute("class", "circle");
            self.rect.appendChild(self.cannon);
        }
        return self.cannon;
    }

    this.cancelShooting = function(event) {
        self.firing = false
        self.rect.removeEventListener("mousedown", self.cancelShooting);
    }

    this.shoot = function(event) {
        var rectSize = self.rect.getBoundingClientRect();
        let rectTopLeft = [0,0],
            rectTopRight = [rectSize.width,0],
            rectBottomLeft = [0,rectSize.height],
            rectBottomRight = [rectSize.width,rectSize.height],
            cannonPosition = [self.cannonX, self.cannonY],
            clickPosition = [event.offsetX, event.offsetY],
            collisionTop = math.intersect(rectTopLeft, rectTopRight, cannonPosition, clickPosition);
            collisionBottom = math.intersect(rectBottomLeft, rectBottomRight, cannonPosition, clickPosition);
            collisionLeft = math.intersect(rectTopLeft, rectBottomLeft, cannonPosition, clickPosition),
            collisionRight = math.intersect(rectTopRight, rectBottomRight, cannonPosition, clickPosition),
            leftToRight = self.cannonX<event.offsetX,
            rightToLeft = self.cannonX>event.offsetX,
            topToBottom = self.cannonY<event.offsetY,
            bottomToTop = self.cannonY>event.offsetY;
            
        function inRectangle(coordinate){
            if (coordinate==false) return false;
            var result = (coordinate!=null && 
                coordinate[0]>=0 && 
                coordinate[0]<=rectSize.width && 
                coordinate[1]>=0 && 
                coordinate[1]<=rectSize.height
            );
            return result;
        }

        let collisionTarget = false;
        if (inRectangle(collisionTop) && bottomToTop){
            collisionTarget = collisionTop;
        }
        if (inRectangle(collisionBottom) && topToBottom){
            collisionTarget = collisionBottom;
        }
        if (inRectangle(collisionLeft) && rightToLeft){
            collisionTarget = collisionLeft;
        }
        if (inRectangle(collisionRight) && leftToRight){
            collisionTarget = collisionRight;
        }
        let bullet = document.createElement("div");
        self.rect.appendChild(bullet);
        bullet.setAttribute('class', 'bullet');
        bullet.style.top = self.cannonY + 5 + "px";
        bullet.style.left = self.cannonX +5 + "px";
        window.setTimeout(() => {
            bullet.style.top = collisionTarget[1] + "px";
            bullet.style.left = collisionTarget[0] + "px";
        }, 50);
        window.setTimeout(function () {
            self.rect.removeChild(bullet);
        }, 3000);
    }

    this.cannonShooting = function(event) {
        if (self.firing) { self.shoot(event) }
    }
    this.fireCannon = function(event) {
        self.firing = true
        self.rect.addEventListener("mousemove", function (event) {
            self.cannonShooting(event);
        });
    }

    this.deleteCannon = function() {
        if (self.cannon){
            self.rect.removeChild(self.cannon);
            self.cannon = null;
        }
    }

    this.createRectangle();
}

var con1 = document.getElementById("con1");
var con2 = document.getElementById("con2");
var cMaker1 = new canvasMaker(con1,"#432433","#432435");
var cMaker2 = new canvasMaker(con2,"#766666","#665555");