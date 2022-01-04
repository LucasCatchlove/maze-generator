let grid = []
let cells = []
let rows =  17, cols = 17
let side = 40

let current
let startingI
let startingJ
let endingI
let endingJ

let mazeGenerated = false
let mazeSolved = false
let beginSolving = false
let beginGeneration = false

let ppBtn
let stepBtn
let solveBtn
let newMazeBtn


function setup() {

  let canvas = createCanvas((rows * side), (cols * side))
  canvas.parent('canvas-container')
  frameRate(20)

  startingI = floor(random(0, floor(rows / 3)))
  startingJ = floor(random(0, floor(cols / 3)))
  endingI = floor(random(floor(rows / 3), rows))
  endingJ = floor(random(floor(cols / 3), cols))

  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      grid.push(new Cell(i, j))

  current = grid[0]
  current.visited = true

  grid.forEach(cell => cell.display())

  ppBtn = document.getElementById('playpause-btn')
  ppBtn.addEventListener('click', pause)
  ppBtn.disabled = true

  stepBtn = document.getElementById('step-btn')
  stepBtn.addEventListener('click', step)
  stepBtn.disabled = true

  solveBtn = document.getElementById('solve-btn')
  solveBtn.addEventListener('click', solve)
  solveBtn.disabled = true

  newMazeBtn = document.getElementById('newmaze-btn')
  newMazeBtn.addEventListener('click', newMaze)
}


function pause() {
  noLoop()
  ppBtn.innerHTML = "play"
  ppBtn.removeEventListener('click', pause)
  ppBtn.addEventListener('click', play)
}



function play() {
  loop()
  ppBtn.innerHTML = "pause"
  ppBtn.removeEventListener('click', play)
  ppBtn.addEventListener('click', pause)

}



function step() {
  ppBtn.innerHTML = "play"
  ppBtn.addEventListener('click', play)
  noLoop()
  draw()
}



function newMaze() {
  cells = []
  current = grid[0]
  solveBtn.innerHTML = "solve maze"
  beginGeneration = true
  ppBtn.disabled = false
  stepBtn.disabled = false
  if (mazeGenerated) {
    if (!mazeSolved)
      newMazeBtn.disabled = false

    ppBtn.disabled = false
    stepBtn.disabled = false
    solveBtn.disabled = true
    mazeSolved = false
  }

  mazeGenerated = false

  grid.forEach(cell => {
    cell.visited = false
    cell.solnMember = false
    cell.walls = [true, true, true, true]
  })

  ppBtn.innerHTML = "pause"
  loop()

}



function solve() {
  ppBtn.disabled = false
  stepBtn.disabled = false
  solveBtn.disabled = true

  if (mazeSolved) {
    ppBtn.disabled = false
    stepBtn.disabled = false

    startingI = floor(random(0, floor(rows / 1.25)))
    startingJ = floor(random(0, floor(cols / 1.5)))
    endingI = floor(random(floor(rows / 4), rows))
    endingJ = floor(random(floor(cols / 4), cols))
    
  }
  beginSolving = true
  mazeSolved = false

  grid.forEach(cell => {
    cell.visited = false
    cell.solnMember = false
  })

  current = grid[index(startingI, startingJ)]
  current.visited = true
  current.solnMember = true
  mazeSolved = false
  solveBtn.innerHTML = "solve for new points"
  ppBtn.innerHTML = "pause"
  loop()
}



function draw() {
  
  beginGeneration ? (!mazeGenerated ? recursiveBacktracker() : DFS()) : null
}



function recursiveBacktracker() {
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
    current.solnMember = true

    solveBtn.disabled = false
    ppBtn.disabled = true
    stepBtn.disabled = true

    grid.forEach(cell => cell.display())
  }
}



function DFS() {
  if (!mazeSolved && beginSolving) {
    grid.forEach(cell => cell.display())
    let next = current.findPassage()

    if (current.this.i == endingI && current.this.j == endingJ) {
      noLoop()
      mazeSolved = true
      ppBtn.disabled = true
      stepBtn.disabled = true
      solveBtn.disabled = false
      newMazeBtn.disabled = false
      grid.forEach(cell => cell.display())
    }

    else if (next) {
      next.visited = true
      next.solnMember = true
      cells.push(current)
      current = next
    }

    else if (cells.length > 0) {
      current.solnMember = false
      current = cells.pop()
    }
  }
}



function Cell(i, j) {
  this.i = i
  this.j = j
  this.visited = false
  this.solnMember = false
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

      if (this.solnMember) {
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

    let N = grid[index(this.this.i - 1, this.this.j)]
    let S = grid[index(this.this.i + 1, this.this.j)]
    let E = grid[index(this.this.i, this.this.j + 1)]
    let W = grid[index(this.this.i, this.this.j - 1)]

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
    return i*rows + j
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

  else {
    next.walls[2] = false
    current.walls[3] = false
  }
}