const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const scoreDisplay = document.querySelector(".score--value")
const finalScoreDisplay = document.querySelector(".final-score > span")
const menuScreen = document.querySelector(".menu-screen")
const playButton = document.querySelector(".btn-play")

const audioEat = new Audio("../assets/audio.mp3")

const cellSize = 30
const canvasSize = 600

const initialPosition = { x: 270, y: 240, color: "green" }

let snake = [initialPosition]
let direction, loopId, isGameOver

const generateRandomNumber = (min, max) =>
    Math.round(Math.random() * (max - min) + min)

const getRandomGridPosition = () => {
    const number = generateRandomNumber(0, canvas.width - cellSize)
    return Math.round(number / cellSize) * cellSize
}

const getRandomColor = () => {
    const r = generateRandomNumber(0, 255)
    const g = generateRandomNumber(0, 255)
    const b = generateRandomNumber(0, 255)
    return `rgb(${r}, ${g}, ${b})`
}

const food = {
    x: getRandomGridPosition(),
    y: getRandomGridPosition(),
    color: getRandomColor()
}

const increaseScore = () => {
    scoreDisplay.innerText = +scoreDisplay.innerText + 10
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = cellSize; i < canvas.width; i += cellSize) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvasSize)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvasSize, i)
        ctx.stroke()
    }
}

const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, cellSize, cellSize)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === snake.length - 1 ? "white" : segment.color
        ctx.fillRect(segment.x, segment.y, cellSize, cellSize)
    })
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]
    let newHead

    if (direction === "right") {
        newHead = { x: head.x + cellSize, y: head.y, color: head.color }
    }
    if (direction === "left") {
        newHead = { x: head.x - cellSize, y: head.y, color: head.color }
    }
    if (direction === "down") {
        newHead = { x: head.x, y: head.y + cellSize, color: head.color }
    }
    if (direction === "up") {
        newHead = { x: head.x, y: head.y - cellSize, color: head.color }
    }

    snake.push(newHead)
    snake.shift()
}

const checkFoodCollision = () => {
    const head = snake[snake.length - 1]

    if (head.x === food.x && head.y === food.y) {
        increaseScore()
        audioEat.play()

        const newSegment = { ...head, color: food.color }
        snake.push(newSegment)

        let x = getRandomGridPosition()
        let y = getRandomGridPosition()

        while (snake.some(segment => segment.x === x && segment.y === y)) {
            x = getRandomGridPosition()
            y = getRandomGridPosition()
        }

        food.x = x
        food.y = y
        food.color = getRandomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const limit = canvas.width - cellSize
    const neckIndex = snake.length - 2

    const hitWall =
        head.x < 0 || head.x > limit || head.y < 0 || head.y > limit

    const hitSelf = snake.some((segment, index) =>
        index < neckIndex && segment.x === head.x && segment.y === head.y
    )

    if (hitWall || hitSelf) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    clearTimeout(loopId)
    isGameOver = true


    menuScreen.style.display = "flex"
    finalScoreDisplay.innerText = scoreDisplay.innerText
    canvas.style.filter = "blur(2px)"
}

const gameLoop = () => {
    clearTimeout(loopId)

    ctx.clearRect(0, 0, canvasSize, canvasSize)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkFoodCollision()
    checkCollision()

    loopId = setTimeout(gameLoop, 300)
}


document.addEventListener("keydown", ({ key }) => {
     if (isGameOver) return;

    const lowerCaseKey = key.toLowerCase();

    if ((lowerCaseKey === "arrowright" || lowerCaseKey === "d") && direction !== "left") {
        direction = "right"
    }
    if ((lowerCaseKey === "arrowleft" || lowerCaseKey === "a") && direction !== "right") {
        direction = "left"
    }
    if ((lowerCaseKey === "arrowdown" || lowerCaseKey === "s") && direction !== "up") {
        direction = "down"
    }
    if ((lowerCaseKey === "arrowup" || lowerCaseKey === "w") && direction !== "down") {
        direction = "up"
    }
})

playButton.addEventListener("click", () => {
    scoreDisplay.innerText = "00"
    menuScreen.style.display = "none"
    canvas.style.filter = "none"
    snake = [{ x: 270, y: 240, color: "green" }]
    direction = undefined
    isGameOver = false
    gameLoop()
})

gameLoop()
