
//maze generation 

var width = 15;
var height = 15;

var mazeArr = new Array(height);

function mazeCell() {
    this.topWall = true;
    this.rightWall = true;
    this.bottomWall = true;
    this.leftWall = true;
    this.visited = false;
}

//generates maze array 
for (var row = 0; row < height; row++) {

    mazeArr[row] = new Array(width);

    for (var col = 0; col < width; col++)
        mazeArr[row][col] = new mazeCell()

}

var num = 1;
var t0 = performance.now()
mazeGenerator(0, 0, num)
var t1 = performance.now()

var elapsed = t1 - t0;
console.log(elapsed.toFixed(1) + " ms")


//generates maze html
var maze = document.getElementById('maze');

maze.style.width = (width * 32) + "px";
maze.style.height = (height * 32) + "px";
var cell;
for (var row = 0; row <= mazeArr.length - 1; row++) {
    for (var col = 0; col <= mazeArr[row].length - 1; col++) {
        cell = document.createElement("DIV")
        cell.id = row + "-" + col

        cell.style.width = "30px"
        cell.style.height = "30px"


        if (mazeArr[row][col].topWall)
            cell.style.borderTop = "black 1px solid";
        else
            cell.style.borderTop = "white 1px solid";
        if (mazeArr[row][col].rightWall)
            cell.style.borderRight = "black 1px solid";
        else
            cell.style.borderRight = "white 1px solid";
        if (mazeArr[row][col].bottomWall)
            cell.style.borderBottom = "black 1px solid";
        else
            cell.style.borderBottom = "white 1px solid";
        if (mazeArr[row][col].leftWall)
            cell.style.borderLeft = "black 1px solid";
        else
            cell.style.borderLeft = "white 1px solid";

        maze.appendChild(cell)

    }
}

//aldous-broder algorithm implemented for maze generation
function mazeGenerator(row, col, num) {
    maze = "";
    var current = mazeArr[row][col]
    current.visited = true;
    var ranRow = row
    var ranCol = col

    do {

        var offset = Math.floor(Math.random() * 4)
        if (offset == 0 && ranRow < height - 1)
            ranRow += 1;
        else if (offset == 1 && ranCol < width - 1)
            ranCol += 1
        else if (offset == 2 && ranRow > 0)
            ranRow -= 1;
        else if (offset == 3 && ranCol > 0)
            ranCol -= 1
    }
    while (ranRow == row && ranCol == col)

    if (ranRow >= 0 && ranRow <= height - 1 && ranCol >= 0 && ranCol <= width - 1 && num <= width * height - 1) {

        if (ranRow > row && num <= width * height - 1) {
            if (mazeArr[ranRow][ranCol].visited == false) {

                current.bottomWall = false;
                mazeArr[ranRow][ranCol].topWall = false;
                num++;
            }
            mazeGenerator(ranRow, ranCol, num)
        }

        if (ranCol > col && num <= width * height - 1) {
            if (mazeArr[ranRow][ranCol].visited == false) {

                current.rightWall = false;
                mazeArr[ranRow][ranCol].leftWall = false;
                num++
            }
            mazeGenerator(ranRow, ranCol, num)
        }

        if (ranRow < row && num <= width * height - 1) {
            if (mazeArr[ranRow][ranCol].visited == false) {

                current.topWall = false;
                mazeArr[ranRow][ranCol].bottomWall = false;
                num++
            }
            mazeGenerator(ranRow, ranCol, num)
        }

        if (ranCol < col && num <= width * height - 1) {
            if (mazeArr[ranRow][ranCol].visited == false) {
                current.leftWall = false;
                mazeArr[ranRow][ranCol].rightWall = false;
                num++
            }
            mazeGenerator(ranRow, ranCol, num)
        }

    }

  


}


var num = 0;


function mazeSolverDFS(row, col) {

    var id = row + "-" + col;

    if (!(row == height - 1 && col == width - 1) && mazeArr[row][col].visited) {

        var current = mazeArr[row][col]
        mazeArr[row][col].visited = false;
        document.getElementById(id).innerHTML += String(num++);

        //top
        if (row > 0 && mazeArr[row - 1][col].visited && !current.topWall) {
            document.getElementById(id).style.backgroundColor = "white"
            mazeSolverDFS(row - 1, col)
            if(document.getElementById(id).style.backgroundColor != "lightgrey")
            document.getElementById(id).style.backgroundColor = "lightgrey"        }

        //left
        if (col > 0 && mazeArr[row][col - 1].visited && !current.leftWall) {
            mazeSolverDFS(row, col - 1)
            if(document.getElementById(id).style.backgroundColor != "lightgrey")
            document.getElementById(id).style.backgroundColor = "lightgrey"        }

        //bottom
        if (row < height - 1 && mazeArr[row + 1][col].visited && !current.bottomWall) {
           
            if(document.getElementById(id).style.backgroundColor != "lightgrey")
            document.getElementById(id).style.backgroundColor = "lightgrey"
            mazeSolverDFS(row + 1, col)
        }

        //right
        if (col < width - 1 && mazeArr[row][col + 1].visited && !current.rightWall) {
            mazeSolverDFS(row, col + 1)
            if(document.getElementById(id).style.backgroundColor != "lightgrey")
            document.getElementById(id).style.backgroundColor = "lightgrey"
        }
    }

    else {
        document.getElementById(id).style.backgroundColor = "red"
        document.getElementById(id).innerHTML = "<B>END</B>"
        return
    }

    
}










