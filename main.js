// let calculate = false;

// let width = document.body.clientWidth;
// let height = window.innerHeight - 4;
// let rectSize = width / 100;

// console.log(width, " ", height);

// const app = new PIXI.Application(width, height, {backgroundColor:0x000000});

// document.body.appendChild(app.view);

// const button = new PIXI.Graphics()
//     .beginFill(0x00ff00)
//     .drawCircle(width / 2, height - 50, 20)
//     .endFill();

// button.interactive = true;
// button.buttonMode = true;
// button.on('pointerdown', execute);
// app.stage.addChild(button);

// const graphics = new PIXI.Graphics();
// graphics.on('pointerdown', onClick);
// app.stage.addChild(graphics);

// let grid = new Array();
// initialize();

// function execute() {
//     if(calculate === false)
//     {
//         calculate = true;
//         graphics.interactive = false;

//         button.clear();
//         button.beginFill(0xff0000)
//         .drawCircle(width / 2, height - 50, 20)
//         .endFill();
//     }
//     else
//     {
//         calculate = false;
//         initialize();

//         button.clear()
//         button.beginFill(0x00ff00)
//         .drawCircle(width / 2, height - 50, 20)
//         .endFill();
//     }
// }


// function onClick(event) {
//     let x = Math.floor(event.data.global.x / rectSize);
//     let y = Math.floor(event.data.global.y / rectSize);
//     if(grid[x][y][0] === 0)
//     {
//         grid[x][y] = [1, 1];
//         graphics.beginFill(0xFFFFFF)
//         .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)

//     }
//     else
//     {
//         grid[x][y] = [0, 0];
//         graphics.beginFill(0x000000)
//         .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)

//     }
//     graphics.endFill();
// }

// function redraw()
// {
//     graphics.clear();
//     for(let x = 0; x < grid.length; x++)
//     {
//         for(let y = 0; y < grid[x].length; y++)
//         {
//             grid[x][y][0] = grid[x][y][1];
//             if(grid[x][y][0] === 1)
//             {
//                 graphics.beginFill(0xFFFFFF)
//                 .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
//             }
//             else
//             {
//                 graphics.beginFill(0x000000)
//                 .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
//             }
//         }
//     }
//     graphics.endFill();
// }

// function recalculate()
// {
//     for(let x = 0; x < grid.length; x++)
//     {
//         for(let y = 0; y < grid[x].length; y++)
//         {
//             let count = calculateNeighbor(x, y);

//             if(grid[x][y][0] === 1) // Alive
//             {
//                 if (count < 2 || count > 3)
//                 {
//                     grid[x][y][1] = 0; // Mark for deletion
//                 }  
//             }
//             else
//             {
//                 if(count === 3)
//                 {
//                     grid[x][y][1] = 1; // Mark for creation
//                 }
//             }

//         }
//     }
// }

// function calculateNeighbor(x, y)
// {
//     let count = 0;
//     for(let i = (x - 1) < 0 ? 0 : (x - 1); i <= (x + 1) && i < grid.length; i++)
//     {
//         for(let j = (y - 1) < 0 ? 0 : (y - 1); j <= (y + 1) && j < grid[0].length; j++)
//         {
//             if(i === x && j === y) continue;

//             if(grid[i][j][0] === 1)
//             {
//                 count++;
//             }
//         }
//     }
//     return count;
// }

// function initialize() {
//     grid = new Array(Math.floor(width / rectSize));
//     graphics.clear();
//     graphics.beginFill(0x000000)
//     for(let x = 0; x < grid.length; x++)
//     {
//         grid[x] = new Array(Math.floor((height - 100) / rectSize))
//         for(let y = 0; y < grid[x].length; y++)
//         {
//             grid[x][y] = [0, 0];

//             graphics
//             .lineStyle(1, 0x999999, 1, 1)
//             .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
//         }
//     }
//     graphics.endFill();
//     graphics.interactive = true;
// }

// let timer = 0.0;
// app.ticker.add((delta) =>{
//     if(calculate === false) return;
//     timer += delta;
//     {
//         if(timer > 10.0)
//         {
//             timer = 0.0;
//             recalculate();
//             redraw();
//         }
//     }
// })

// // UI -----------------------------------

// window.addEventListener('resize', resize);

// function resize() {
//     app.renderer.resize(width, height);
// }

// resize();

const app = new PIXI.Application({
    width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);

// Create a new texture
const texture = PIXI.Texture.from('sample.png');

// Create a 5x5 grid of bunnies
for (let i = 0; i < 25; i++) {
    const bunny = new PIXI.Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
}

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    container.rotation -= 0.01 * delta;
});
