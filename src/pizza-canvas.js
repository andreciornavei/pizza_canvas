(function () {
    // Define our constructor
    this.PizzaCanvas = function () {
        // Define imutable options defaults
        var unprops = {
            FULL_CIRCLE: 360,
            canvas: undefined,
            ctx: undefined,
            size: undefined,
            centerX: 0,
            centerY: 0,
            pizzaRay: undefined,
            flavorRay: undefined,
            hoverSliceRadian: undefined,
            onSliceClick: undefined,
            assets: {},
            data: {},
            preview: undefined
        }

        //define mutable options defaults
        var defaults = {
            canvasId: undefined,
            canvasBorder: undefined,
            canvasBackground: undefined,
            slices: 1,
            padding: 0,
            trayBorder: 0,
        }
        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
            this.options = extendDefaults(this.options, unprops);
        }

        //initialize canvas
        this.options.canvas = document.getElementById(this.options.canvasId)
        this.options.ctx = this.options.canvas.getContext('2d');

        //initialize calcs and styles
        this.options.size = this.options.canvas.width > this.options.canvas.height ? this.options.canvas.height : this.options.canvas.width;
        this.options.size -= this.options.padding * 2;
        this.options.pizzaRay = this.options.size / 2
        this.options.flavorRay = this.options.size / 2 - this.options.trayBorder
        this.options.centerX = (this.options.canvas.width - (this.options.padding * 2)) / 2 + this.options.padding
        this.options.centerY = (this.options.canvas.height - (this.options.padding * 2)) / 2 + this.options.padding
        //style canvas
        this.options.canvas.style.backgroundColor = this.options.background
        this.options.canvas.style.width = this.options.canvas.width
        this.options.canvas.style.height = this.options.canvas.height
        registerEvents.call(this)
        render.call(this)
    }

    //public methods

    PizzaCanvas.prototype.setSlices = function (slices) {
        let newSlices = parseInt(slices)
        if (newSlices <= 0) {
            newSlices = 1
        }
        this.options.slices = newSlices
        render.call(this)
    }

    PizzaCanvas.prototype.setTrayAsset = function (src) {
        loadAsset.call(this, 'tray', src)
    }

    PizzaCanvas.prototype.onSliceClick = function (callback) {
        this.options.onSliceClick = callback
    }

    PizzaCanvas.prototype.fireSlicePosition = function (x, y) {
        const radian = calcHoverSlide.call(this, x, y)
        if (radian != undefined) {
            return getIndexFromRadian.call(this, radian)
        } else {
            return undefined;
        }
    }

    PizzaCanvas.prototype.previewSlice = function (index, src) {
        if (this.options.preview != undefined && this.options.preview.src == src) {
            this.options.preview.index = index
            render.call(this)
        } else {
            loadPreview.call(this, index, src)
        }
    }

    PizzaCanvas.prototype.clearPreview = function () {
        this.options.preview = undefined
        render.call(this)
    }

    PizzaCanvas.prototype.setSliceAsset = function (index, src, data) {
        this.options.data[index] = data;
        loadAsset.call(this, index, src)
    }

    PizzaCanvas.prototype.removeSlice = function (index) {
        if (this.options.assets[index] != undefined) {
            this.options.assets[index] = undefined
        }
        if (this.options.data[index] != undefined) {
            this.options.data[index] = undefined
        }
        render.call(this)
    }

    PizzaCanvas.prototype.clear = function () {
        for (var i = 0; i < this.options.slices; i++) {
            this.options.assets[i] = undefined
            this.options.data[i] = undefined
        }
        render.call(this)
    }

    PizzaCanvas.prototype.getData = function () {
        return this.options.data;
    }

    PizzaCanvas.prototype.getSliceData = function (index) {
        return this.options.data[index];
    }

    //private methods

    function loadPreview(index, src) {
        var asset = new Image();
        asset.src = src;
        asset.onload = (e) => {
            this.options.preview = {
                index: index,
                src: src,
                img: e.path[0]
            }
            render.call(this);
        };
    }

    function loadAsset(key, src) {
        var asset = new Image();
        asset.src = src;
        asset.onload = (e) => {
            this.options.assets[key] = e.path[0];
            render.call(this);
        };
    }

    function registerEvents() {
        this.options.canvas.addEventListener("mousemove", (event) => {
            onMouseMove.call(this, event);
        }, false);
        this.options.canvas.addEventListener("click", (event) => {
            onMouseClick.call(this, event);
        }, false);
    }

    function onMouseClick(e) {
        if (
            this.options.onSliceClick != undefined &&
            this.options.hoverSliceRadian != undefined
        ) {
            const index = getIndexFromRadian.call(this, this.options.hoverSliceRadian);
            this.options.onSliceClick(index, this.options.data[index])
        }
    }

    function onMouseMove(e) {
        this.options.hoverSliceRadian = calcHoverSlide.call(this, e.pageX, e.pageY)
        render.call(this)
    }

    function calcHoverSlide(pageX, pageY) {
        const x = pageX - this.options.canvas.getBoundingClientRect().left - window.scrollX;
        const y = pageY - this.options.canvas.getBoundingClientRect().top - window.scrollY;
        const dx = x - this.options.centerX;
        const dy = y - this.options.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.options.flavorRay) {
            //calc radians from cursor to center and convert to angle
            let radians = Math.atan2(y - this.options.centerY, x - this.options.centerX)
            if (radians < 0) {
                radians = (Math.PI + radians) + Math.PI
            }
            return radians;
        } else {
            return undefined;
        }
    }

    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function getIndexFromRadian(radians) {
        const sizeSlice = this.options.FULL_CIRCLE / this.options.slices
        for (let i = 1; i <= this.options.slices; i++) {
            const startRadian = (i - 1) * degreesToRadians(sizeSlice)
            const endRadian = i * degreesToRadians(sizeSlice)
            if (
                radians >= startRadian &&
                radians <= endRadian
            ) {
                return i - 1;
            }
        }
        return undefined;
    }

    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    function erase() {
        this.options.ctx.clearRect(0, 0, this.options.canvas.width, this.options.canvas.height);
    }

    function render() {
        erase.call(this)
        if (this.options.assets['tray']) {
            //draw tray as image
            this.options.ctx.save()
            this.options.ctx.drawImage(
                this.options.assets['tray'],//image
                this.options.centerX - this.options.pizzaRay,//x location
                this.options.centerY - this.options.pizzaRay,//y location
                this.options.pizzaRay * 2,//width
                this.options.pizzaRay * 2,//height
            );
            this.options.ctx.globalCompositeOperation = 'destination-in';
            this.options.ctx.beginPath();
            this.options.ctx.fillStyle = '#000000'
            this.options.ctx.arc(
                this.options.centerX,
                this.options.centerY,
                this.options.pizzaRay,
                0,
                degreesToRadians(this.options.FULL_CIRCLE),
            );
            this.options.ctx.closePath();
            this.options.ctx.fill();
            this.options.ctx.restore()
        } else {
            //dray tray as shape
            this.options.ctx.fillStyle = '#BB392D'
            this.options.ctx.beginPath();
            this.options.ctx.arc(
                this.options.centerX,
                this.options.centerY,
                this.options.pizzaRay,
                0,
                degreesToRadians(this.options.FULL_CIRCLE),
            );
            this.options.ctx.closePath();
            this.options.ctx.fill();
        }

        //define sizeslices
        const sizeSlice = this.options.FULL_CIRCLE / this.options.slices

        //print slices images
        this.options.ctx.lineWidth = 0
        for (let i = 1; i <= this.options.slices; i++) {
            const renderImage = this.options.preview != undefined && this.options.preview.index == i - 1 ? this.options.preview.img : this.options.assets[i - 1]
            if (renderImage) {
                const startRadian = (i - 1) * degreesToRadians(sizeSlice)
                const endRadian = i * degreesToRadians(sizeSlice)
                this.options.ctx.fillStyle = "#000000"
                this.options.ctx.save();
                this.options.ctx.beginPath();
                this.options.ctx.moveTo(this.options.centerX, this.options.centerY);
                this.options.ctx.arc(
                    this.options.centerX,
                    this.options.centerY,
                    this.options.flavorRay,
                    startRadian,
                    endRadian,
                );
                this.options.ctx.closePath();
                this.options.ctx.clip();
                this.options.ctx.drawImage(
                    renderImage,
                    this.options.centerX - this.options.flavorRay,
                    this.options.centerY - this.options.flavorRay,
                    this.options.flavorRay * 2,
                    this.options.flavorRay * 2
                );
                this.options.ctx.restore();
            }
        }

        //print slices outline selectors
        this.options.ctx.lineWidth = 1
        this.options.ctx.strokeStyle = '#333333'
        for (let i = 1; i <= this.options.slices; i++) {
            const startRadian = (i - 1) * degreesToRadians(sizeSlice)
            const endRadian = i * degreesToRadians(sizeSlice)
            if (
                this.options.hoverSliceRadian != undefined &&
                this.options.hoverSliceRadian >= startRadian &&
                this.options.hoverSliceRadian <= endRadian
            ) {
                this.options.ctx.fillStyle = 'rgba(0,0,0,.2)'
            } else {
                this.options.ctx.fillStyle = 'rgba(0,0,0,0)'
            }

            this.options.ctx.beginPath();
            this.options.ctx.moveTo(this.options.centerX, this.options.centerY);
            this.options.ctx.arc(
                this.options.centerX,
                this.options.centerY,
                this.options.flavorRay,
                startRadian,
                endRadian,
            );            
            this.options.ctx.stroke();
            this.options.ctx.fill();
        }
    }

}());