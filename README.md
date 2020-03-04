# pizza_canvas

_pizza_canvas is an open source project made with javascript that allows an application to build a pizza with canvas interface and interactions._

![](preview.gif)

## Designed for
Websites and applications who wants to deliver better experiences for your customers and any project that wants to implement a pizza interface with a simple way to integrate using an easy api for that.
 
## Features

 * Loads a tray image as background
 * Sets a number of pizza slices
 * Sets an image and custom data to a specific slice
 * Remove an image and custom data from a specific slice
 * Preview a slice image on cursor position on hover
 * Identify a slice index by mouse position
 * Get all slices data
 * Get slice data by index
 * Clear all images and data

## Installation

This is a pure javascript library available through the
[npm registry](https://www.npmjs.com/) and no dependency is required.


```bash
$ npm install pizza_canvas
```
## Usage

```html
<canvas width="364" height="364" id="pizza"></canvas>
<script src="node_modules/pizza_canvas/src/pizza-canvas.js"></script>
<script>
    const pizza = new PizzaCanvas({
        canvasId: "pizza",
        background: "#e4e4e4",
        slices: 4,
        padding: 50,
        trayBorder: 12,
    });
</script>
```
You can set any size to your canvas and the library will adapt to this size.

To view a full example, just open the project library and run example/index.html in your browser.
   * In the example was used a library from jquery.ui to make a drag and drop experience but you can use any library to reproduce this approach.

## API
* Before call any function, be sure to create an instance of library:
```javascript
    const pizza = new PizzaCanvas({
        //The canvas identifier;
        canvasId: "canvas_id",        
        //A style to the canvas if necessary;
        canvasBorder: "1px solid black",
        //A background to the canvas if necessary;
        canvasBackground: "#e4e4e4",
        //The initial number of slices to the pizza;        
        slices: 1,
        //The space between pizza and canvas border
        padding: 0,
        //The space between tray border and flavor slices;
        trayBorder: 0,
    });
```

 * Loading a tray image as background:
```javascript
    pizza.setTrayAsset('path/to/yours/tray_image.png')
```

* Setting the number of pizza slices:
```javascript
    pizza.setSlices(8)
```

* This event will be fired when a slice is clicked, then you can pass a callback function as a parameter where you will receive an index slice clicked or undefined if clicked out of some slice inside canvas:
```javascript
    pizza.onSliceClick(function(index){
        console.log("pizza clicked on slice:", index);
    })
```

* You can call any user interaction event like, mousemove, mouseclick, touch or any event according the library you are using, then, you can get the coordinate X and Y from this event and call fireSlicePosition to check if it is inside some slice, and if true, it will return the index slice, otherwise returns undefined:
```javascript
    function mousemoved(event) {
        const index = pizza.fireSlicePosition(
            event.clientX, 
            event.clientY
        );
        console.log("mouse hover slice:", index)
    }
```

* Using yours interaction event combined with 'fireSlicePosition' api, you will receive a slice index, then you can preview some image to this slice:
```javascript
    const sliceIndex = 0;
    pizza.previewSlice(sliceIndex, 'path/to/yours/pizza_flavor.png')
```

* Using yours interaction event combined with 'fireSlicePosition' api, you will receive a slice index, then if it is undefined, you can call 'clearPreview' to remove the preview image:
```javascript
    pizza.clearPreview()
```

* Using yours interaction event combined with 'fireSlicePosition' api, normally a drop event, or using 'onSliceClick' api, you will receive the slice index, then you can get the dropped or selected data and set to canvas:
```javascript
    const sliceIndex = 0;
    const image = 'path/to/yours/pizza_flavor.png';
    const data = {
        id: 1,
        name: 'pepperoni',
    };
    pizza.setSliceAsset(sliceIndex, image, data)
```

* Using yours interaction event combined with 'fireSlicePosition' api, or using 'onSliceClick' api, you will receive the slice index, then you can remove the slice data from canvas:
```javascript
    const sliceIndex = 0;
    pizza.removeSlice(sliceIndex)
```

* You can call 'getData' api any time to return all setted slices data:
```javascript
    const data = pizza.getData();
    console.log('All setted flavors:', data)
```

* Using yours interaction event combined with 'fireSlicePosition' api, or using 'onSliceClick' api, you will receive the slice index, then you can call 'getSliceData' api any time to return the selected data:
```javascript
    const sliceIndex = 0;
    const data = pizza.getSliceData(sliceIndex);
    console.log('Selected slice data:', data)
```

* You can call 'clear' api any time to clear all images and data from canvas:
```javascript
    pizza.clear()
```












## License

  [MIT](LICENSE)