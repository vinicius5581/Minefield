function Minefield(elementId, rows, cols, qty) {
    this.el = elementId || 'minefield';
    this.height = rows;
    this.width = cols;
    this.matrix = this.generateBombsMatrixEnhanced(rows, cols, qty);

    this.render();
    this.handleClickListener();
}

Minefield.prototype.generateBombsMatrixEnhanced = function(height, width, qty) {
    const bombsMatrix = [];

    for (let row = 0; row < height; row++) {
        bombsMatrix[row] = [];
        for (let col = 0; col < width; col++) {
            bombsMatrix[row][col] = {
                isBomb: false,
                isRevealed: false,
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
    return this.matrix[row][col].isBomb;
};

Minefield.prototype.reveal = function(row, col) {
    const cel = document.getElementById(`${row}-${col}`);
    if (!cel.classList.contains('open')) {
        cel.classList.add('open');
        this.matrix[row][col].isRevealed = true;
        if (this.matrix[row][col].isBomb) {
            cel.classList.add('bomb');
            this.openAll();
        } else {
            cel.innerHTML = this.matrix[row][col].neighboors;
        }
    }
};

Minefield.prototype.openCel = function(e) {
    const id = e.target.id;
    const row = parseInt(id.split('')[0]);
    const col = parseInt(id.split('')[2]);
    this.reveal(row, col);
    console.log(this.matrix);
};

Minefield.prototype.openAll = function() {
    for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
            this.reveal(row, col);
        }
    }
};

const game = new Minefield('game', 5, 5, 10);
