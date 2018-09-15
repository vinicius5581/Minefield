function Minefield(el, rows, cols, qty) {
    this.el = el;
    this.matrix = this.generateBombsMatrix(rows, cols, qty);
    this.height = rows;
    this.width = cols;
    this.neighboors = this.getBombsNeighboorsMatrix();

    this.render();
    this.handleClickListener();
    console.log(this.generateBombsMatrixEnhanced(rows, cols, qty));
}

Minefield.prototype.generateBombsMatrix = function(height, width, qty) {
    const bombsMatrix = [];

    for (let row = 0; row < height; row++) {
        bombsMatrix[row] = [];
        for (let col = 0; col < width; col++) {
            bombsMatrix[row][col] = 0;
        }
    }

    for (let count = 0; count < qty; count++) {
        const row = Math.floor(Math.random() * height);
        const col = Math.floor(Math.random() * width);
        bombsMatrix[row][col] = 1;
    }
    return bombsMatrix;
};

Minefield.prototype.generateBombsMatrixEnhanced = function(height, width, qty) {
    const bombsMatrix = [];

    for (let row = 0; row < height; row++) {
        bombsMatrix[row] = [];
        for (let col = 0; col < width; col++) {
            bombsMatrix[row][col] = {
                isBomb: false,
                neighboors: 0
            };
        }
    }

    for (let count = 0; count < qty; count++) {
        const row = Math.floor(Math.random() * height);
        const col = Math.floor(Math.random() * width);
        bombsMatrix[row][col].isBomb = true;
    }

    bombsMatrix.forEach((rArr, row) =>
        rArr.forEach((cArr, col) => {
            let sum = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    const nX = row + x;
                    const nY = col + y;
                    if (
                        nX > 0 &&
                        nX < rArr.length &&
                        nY > 0 &&
                        nY < bombsMatrix.length &&
                        !(x === 0 && y === 0) &&
                        bombsMatrix[nX][nY].isBomb
                    ) {
                        sum++;
                    }
                }
            }
            bombsMatrix[row][col].neighboors = sum;
        })
    );

    return bombsMatrix;
};

Minefield.prototype.getBombsNeighboorsMatrix = function() {
    const neighboors = [];
    this.matrix.map((row, rIdx) => {
        neighboors[rIdx] = [];
        row.map((col, cIdx) => {
            neighboors[rIdx][cIdx] = 0;
        });
    });

    this.matrix.map((rArr, row) =>
        rArr.map((cArr, col) => {
            let sum = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    const nX = row + x;
                    const nY = col + y;
                    if (
                        nX > 0 &&
                        nX < row.length &&
                        nY > 0 &&
                        nY < matrix.length &&
                        !(x === 0 && y === 0)
                    ) {
                        sum += this.matrix[nX][nY];
                    }
                }
            }
            neighboors[row][col] = sum;
        })
    );
    return neighboors;
};

Minefield.prototype.render = function(rows, col) {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    wrapper.style.height = `${this.height * 20}px`;
    wrapper.style.width = `${this.width * 20}px`;
    for (let row = 0; row < this.height; row++) {
        const rowContainer = document.createElement('div');
        for (let col = 0; col < this.width; col++) {
            const cel = document.createElement('div');
            cel.id = `${row}-${col}`;
            cel.className = 'cel';
            rowContainer.appendChild(cel);
        }
        wrapper.appendChild(rowContainer);
    }
    document.getElementById(this.el).appendChild(wrapper);
};

Minefield.prototype.handleClickListener = function() {
    const wrapper = document.getElementById(this.el);
    wrapper.addEventListener('click', this.openCel.bind(this));
};

Minefield.prototype.isBomb = function(row, col) {
    return this.matrix[row][col];
};

Minefield.prototype.review = function(row, col) {
    const cel = document.getElementById(`${row}-${col}`);
    if (!cel.classList.contains('open')) {
        cel.classList.add('open');
        if (this.isBomb(row, col)) {
            cel.classList.add('bomb');
            this.openAll();
        } else {
            cel.innerHTML = this.neighboors[row][col];
        }
    }
};

Minefield.prototype.openCel = function(e) {
    const id = e.target.id;
    const row = parseInt(id.split('')[0]);
    const col = parseInt(id.split('')[2]);
    this.review(row, col);
};

Minefield.prototype.openAll = function() {
    for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
            this.review(row, col);
        }
    }
};

const game = new Minefield('game', 5, 5, 10);
