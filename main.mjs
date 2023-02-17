import {Application, Graphics} from "https://cdn.jsdelivr.net/npm/pixi.js@7.1.2/dist/pixi.min.mjs"
const app = new Application({ resizeTo: window });

const width = app.renderer.width;
const height = app.renderer.height;
const rectSize = width / 100;

const colCount = Math.floor(width / rectSize);
const rowCount = Math.floor((height - 100) / rectSize);

document.body.appendChild(app.view);

const button = new Graphics()
    .beginFill(0x00ff00)
    .drawCircle(width / 2, height - 50, 20)
    .endFill();

button.interactive = true;
button.buttonMode = true;
button.on('pointerdown', execute);
app.stage.addChild(button);

const squares = new Graphics();
squares.on('pointerdown', onClick);
squares.interactive = true;
app.stage.addChild(squares);

const lines = new Graphics();
app.stage.addChild(lines)
drawLines();

const grid = new Int8Array(colCount * rowCount * 2);
initialize();

let calculate = false;

function execute() {
    calculate = !calculate;
    squares.interactive = !calculate;
    lines.visible = !calculate;

    button
        .clear()
        .beginFill(calculate ? 0xff0000 : 0x00ff00)
        .drawCircle(width / 2, height - 50, 20)
        .endFill();

    if(!calculate)
    {
        initialize();
    }
}


function onClick(event) {
    let x = Math.floor(event.data.global.x / rectSize);
    let y = Math.floor(event.data.global.y / rectSize);

    let opposite = 1 - grid[y * colCount + x];
    grid[y * colCount + x] = opposite;
    grid[colCount * rowCount + y * colCount + x] = opposite;

    squares
        .beginFill(opposite === 1 ? 0xFFFFFF : 0x0)
        .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
        .endFill();
}

function redraw()
{
    squares.clear();
    for(let x = 0; x < colCount; x++)
    {
        for(let y = 0; y < rowCount; y++)
        {
            grid[y * colCount + x] = grid[colCount * rowCount + y * colCount + x];

            squares
                .beginFill(grid[y * colCount + x] === 1 ? 0xFFFFFF : 0x0)
                .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
        }
    }
    squares.endFill();
}

function recalculate()
{
    for(let x = 0; x < colCount; x++)
    {
        for(let y = 0; y < rowCount; y++)
        {
            let count = calculateNeighbor(x, y);

            if(grid[y * colCount + x] === 1) // Alive
            {
                if (count < 2 || count > 3)
                {
                    grid[colCount * rowCount + y * colCount + x] = 0; // Mark for deletion
                }  
            }
            else // Dead
            {
                if(count === 3)
                {
                    grid[colCount * rowCount + y * colCount + x] = 1; // Mark for creation
                }
            }

        }
    }
}

function calculateNeighbor(x, y)
{
    let count = 0;
    for(let i = (x - 1) < 0 ? 0 : (x - 1); i <= (x + 1) && i < colCount; i++)
    {
        for(let j = (y - 1) < 0 ? 0 : (y - 1); j <= (y + 1) && j < rowCount; j++)
        {
            if(i === x && j === y) continue;

            if(grid[j * colCount + i] === 1)
            {
                count++;
            }
        }
    }
    return count;
}

function initialize() {
    grid.fill(0);

    squares
        .clear()
        .beginFill(0x0);

    for(let x = 0; x < colCount; x++)
    {
        for(let y = 0; y < rowCount; y++)
        {
            squares.drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
        }
    }
    squares.endFill();
}

function drawLines()
{
    lines.lineStyle(1, 0xFFFFFF, 0.5);

    for(let x = 0; x < colCount; x++)
    {
        lines.moveTo(x * rectSize, 0).lineTo(x * rectSize, rowCount * rectSize);
    }

    for(let y = 0; y < rowCount; y++)
    {
        lines.moveTo(0, (y + 1) * rectSize).lineTo(width, (y + 1) * rectSize);
    }
}

let timer = 0.0;
app.ticker.add((delta) =>{
    if(calculate === false) return;
    timer += delta;
    {
        if(timer > 10.0)
        {
            timer = 0.0;
            recalculate();
            redraw();
        }
    }
})