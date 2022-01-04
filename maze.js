let grid = []
let cells = []
const rows = 20, cols = 20
const side = 30

let current
let startingI
let startingJ
let endingI
let endingJ

let mazeGenerated = false
let mazeSolved = false
let beginSolving = false
let beginGeneration = false

const playPauseButton = document.getElementById('playpause-btn')
const stepButton = document.getElementById('step-btn')
const solveButton = document.getElementById('solve-btn')
const newMazeButton = document.getElementById('newmaze-btn')


function setup() {

  const canvas = createCanvas((cols * side), (rows * side))
  canvas.parent('canvas-container')
  frameRate(60)

  startingI = floor(random(0, rows))
  startingJ = floor(random(0, cols))
  endingI = floor(random(0, rows))
  endingJ = floor(random(0, cols))


  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      grid.push(new Cell(i, j))

  current = grid[0]
  current.visited = true

  grid.forEach(cell => cell.display())

  playPauseButton.addEventListener('click', pause)
  playPauseButton.disabled = true

  stepButton.addEventListener('click', step)
  stepButton.disabled = true

  solveButton.addEventListener('click', solve)
  solveButton.disabled = true

  newMazeButton.addEventListener('click', newMaze)
}



function pause() {
  noLoop()
  playPauseButton.innerHTML = "play"
  playPauseButton.removeEventListener('click', pause)
  playPauseButton.addEventListener('click', play)
}



function play() {
  loop()
  playPauseButton.innerHTML = "pause"
  playPauseButton.removeEventListener('click', play)
  playPauseButton.addEventListener('click', pause)

}



function step() {
  playPauseButton.innerHTML = "play"
  playPauseButton.addEventListener('click', play)
  noLoop()
  draw()
}



function newMaze() {
  cells = []
  current = grid[0]
  solveButton.innerHTML = "solve maze"
  beginGeneration = true
  playPauseButton.disabled = false
  stepButton.disabled = false

  if (mazeGenerated) {
    if (!mazeSolved)
      newMazeButton.disabled = false

    playPauseButton.disabled = false
    stepButton.disabled = false
    solveButton.disabled = true
    mazeSolved = false
  }

  mazeGenerated = false

  grid.forEach(cell => {
    cell.visited = false
    cell.solutionPathMember = false
    cell.walls = [true, true, true, true]
  })

  playPauseButton.innerHTML = "pause"
  loop()

}



function solve() {
  playPauseButton.disabled = false
  stepButton.disabled = false
  solveButton.disabled = true

  if (mazeSolved) {
    playPauseButton.disabled = false
    stepButton.disabled = false

    startingI = floor(random(0, rows))
    startingJ = floor(random(0, cols))
    endingI = floor(random(0, rows))
    endingJ = floor(random(0, cols))

  }
  beginSolving = true
  mazeSolved = false

  grid.forEach(cell => {
    cell.visited = false
    cell.solutionPathMember = false
  })

  current = grid[index(startingI, startingJ)]
  current.visited = true
  current.solutionPathMember = true
  mazeSolved = false
  solveButton.innerHTML = "solve for new points"
  playPauseButton.innerHTML = "pause"
  loop()
}



function draw() {
  beginGeneration ? (!mazeGenerated ? recursiveBacktrackerGenerator() : dfsSolver()) : null
}



function recursiveBacktrackerGenerator() {
  if (!mazeSolved)
    grid.forEach(cell => cell.display())

  let next = current.checkAdjacentCells()

  if (next) {
    next.visited = true
    cells.push(current)
    removeWalls(current, next)
    current = next
  }

  else if (cells.length > 0)
    current = cells.pop()

  else {
    grid.forEach(cell => cell.visited = false)
    current = grid[index(startingI, startingJ)]
    mazeGenerated = true
    beginSolving = false

    current.visited = true
    current.solutionPathMember = true

    solveButton.disabled = false
    playPauseButton.disabled = true
    stepButton.disabled = true

    grid.forEach(cell => cell.display())
  }
}



function dfsSolver() {
  if (!mazeSolved && beginSolving) {
    grid.forEach(cell => cell.display())
    let next = current.findPassage()

    if (current.i == endingI && current.j == endingJ) {
      noLoop()
      mazeSolved = true
      playPauseButton.disabled = true
      stepButton.disabled = true
      solveButton.disabled = false
      newMazeButton.disabled = false
      grid.forEach(cell => cell.display())
    }

    else if (next) {
      next.visited = true
      next.solutionPathMember = true
      cells.push(current)
      current = next
    }

    else if (cells.length > 0) {
      current.solutionPathMember = false
      current = cells.pop()
    }
  }
}


function Cell(i, j) {
  this.i = i
  this.j = j
  this.visited = false
  this.solutionPathMember = false
  this.walls = [true, true, true, true]
}



Cell.prototype.display = function () {

  if (!mazeGenerated) {
    noStroke()
    fill(255)
    rect(this.i * side, this.j * side, side, side)

    if (current.i == this.i && current.j == this.j)
      if (current != grid[0]) {
        fill(color('#ff7f7f'))
        ellipse(side / 2 + this.i * side, side / 2 + this.j * side, side / 1.75, side / 1.75)
      }

  }

  else {

    if (this.solutionPathMember) {
      noStroke()

      if (mazeSolved)
        fill('#1e88e5')
      else
        fill('#03a9f4')

      ellipse(side / 2 + this.i * side, side / 2 + this.j * side, side / 3.5, side / 3.5)
    }
    else {
      noStroke()
      fill(255)
      rect(this.i * side, this.j * side, side, side)
    }

  }

  if (((this.i == startingI && this.j == startingJ) || (this.i == endingI && this.j == endingJ)) && mazeGenerated) {

    if (mazeSolved) {
      noStroke()
      fill('#1e88e5')
    }
    else
      fill('#1e88e5')

    ellipse(side / 2 + this.i * side, side / 2 + this.j * side, side / 1.75, side / 1.75)

  }

  stroke(150)

  if ((this.walls[0] || grid[index(this.i - 1, this.j)].walls[1]) && this.i != 0) {
    line(this.i * side, this.j * side, this.i * side, (this.j + 1) * side)
    line(this.i * side, this.j * side, this.i * side, (this.j + 1) * side)
  }

  if ((this.walls[1] || grid[index(this.i + 1, this.j)].walls[0]) && this.i != rows - 1) {
    line((this.i + 1) * side, this.j * side, (this.i + 1) * side, (this.j + 1) * side)
    line((this.i + 1) * side, this.j * side, (this.i + 1) * side, (this.j + 1) * side)
  }

  if ((this.walls[2] || grid[index(this.i, this.j + 1)].walls[3]) && this.j != cols - 1) {
    line(this.i * side, (this.j + 1) * side, (this.i + 1) * side, (this.j + 1) * side)
    line(this.i * side, (this.j + 1) * side, (this.i + 1) * side, (this.j + 1) * side)
  }

  if ((this.walls[3] || grid[index(this.i, this.j - 1)].walls[2]) && this.j != 0) {
    line(this.i * side, this.j * side, (this.i + 1) * side, this.j * side)
    line(this.i * side, this.j * side, (this.i + 1) * side, this.j * side)
  }
}



Cell.prototype.checkAdjacentCells = function () {

  let adjacent = []

  let N = grid[index(this.i - 1, this.j)]
  let S = grid[index(this.i + 1, this.j)]
  let E = grid[index(this.i, this.j + 1)]
  let W = grid[index(this.i, this.j - 1)]

  if (N && !N.visited)
    adjacent.push(N)

  if (S && !S.visited)
    adjacent.push(S)

  if (E && !E.visited)
    adjacent.push(E)

  if (W && !W.visited)
    adjacent.push(W)

  if (adjacent.length > 0) {
    let rand = floor(random(0, adjacent.length))
    return adjacent[rand]
  }
  else
    return null
}



Cell.prototype.findPassage = function () {

  let N = grid[index(this.i - 1, this.j)]
  let S = grid[index(this.i + 1, this.j)]
  let E = grid[index(this.i, this.j + 1)]
  let W = grid[index(this.i, this.j - 1)]

  if (N && !N.visited && !this.walls[0])
    return N

  else if (S && !S.visited && !this.walls[1])
    return S

  else if (E && !E.visited && !this.walls[2])
    return E

  else if (W && !W.visited && !this.walls[3])
    return W

  else
    return null
}



function index(i, j) {
  if (i < 0 || j < 0 || i > rows - 1 || j > cols - 1)
    return -1
  else
    return i * cols + j
}



function removeWalls(current, next) {
  if (next.i > current.i) {
    next.walls[0] = false
    current.walls[1] = false
  }

  else if (next.i < current.i) {
    next.walls[1] = false
    current.walls[0] = false
  }

  else if (next.j > current.j) {
    next.walls[3] = false
    current.walls[2] = false
  }

  else if (next.j < current.j) {
    next.walls[2] = false
    current.walls[3] = false
  }
}