const game = (function () {
  // PLAYER
  const player = (function () {
    const players = [];
    const playerContainer = document.querySelector('.player');

    const add = (name, marker) => {
      players.push({ name, marker });
      return { name, marker };
    };

    const displayCurrentPlayer = (marker) => {
      const player = getPlayerByMarker(marker);
      playerContainer.textContent = `Current Player: ${player.name} (${marker})`;
    };

    const displayWinner = (marker) => {
      switch (marker) {
        case 'X':
        case 'O':
          const player = getPlayerByMarker(marker);
          playerContainer.textContent = `${player.name} won!`;
          break;
        case 'T':
          playerContainer.textContent = 'Tie game!';
          break;
        default:
          playerContainer.textContent = 'No winner';
          break;
      }
    };

    const getPlayerByMarker = (marker) => {
      return players.find((player) => player.marker === marker);
    };

    return { add, displayCurrentPlayer, displayWinner };
  })();

  // GAMEBOARD
  const gameboard = (function () {
    const board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    let round = 0;
    const getRound = () => round;
    const addRound = () => round++;

    const getCurrentPlayer = () => {
      const round = getRound();
      return round % 2 === 0 ? 'X' : 'O';
    };

    const addMarker = (pos) => {
      if (board[pos[0]][pos[1]] !== '') throw Error('square is not empty');

      const marker = getCurrentPlayer();
      board[pos[0]][pos[1]] = marker;
      addRound();

      return marker;
    };

    const getWinner = () => {
      // check when game is over
      let emptySquares = 0;

      for (let i = 0; i < board.length; i++) {
        const row = board[i];
        const countsHorizontal = {};

        for (let j = 0; j < row.length; j++) {
          const marker = row[j];
          if (marker === '') emptySquares++;

          if (i === 0) {
            // diagonally
            if (j === 0 || j === 2) {
              const countsDiagonal = {};
              const diagonalBoard = [
                marker,
                board[i + 1][j === 0 ? j + 1 : j - 1],
                board[i + 2][j === 0 ? j + 2 : j - 2],
              ];

              diagonalBoard.map((x) => {
                countsDiagonal[x] = (countsDiagonal[x] || 0) + 1;
              });

              if (countsDiagonal['X'] === 3) return 'X';
              else if (countsDiagonal['O'] === 3) return 'O';
            }

            // vertically
            const countsVertical = {};
            const columnBoard = [marker, board[i + 1][j], board[i + 2][j]];

            columnBoard.map((x) => {
              countsVertical[x] = (countsVertical[x] || 0) + 1;
            });

            if (countsVertical['X'] === 3) return 'X';
            else if (countsVertical['O'] === 3) return 'O';
          }

          // horizontally
          countsHorizontal[marker] = (countsHorizontal[marker] || 0) + 1;
        }

        if (countsHorizontal['X'] === 3) return 'X';
        else if (countsHorizontal['O'] === 3) return 'O';
      }

      if (emptySquares === 0) return 'T';
      return null;
    };

    const restart = () => {
      for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
          board[i][j] = '';
        }
      }

      const markers = document.querySelectorAll('.marker');
      markers.forEach((marker) => {
        marker.textContent = '';
        marker.classList.remove('disabled');
      });
      round = 0;
    };

    const render = () => {
      const container = document.querySelector('.container');

      board.forEach(function (row, rowIndex) {
        row.forEach(function (marker, markerIndex) {
          const markerElement = document.createElement('div');
          markerElement.textContent = marker;
          markerElement.classList.add('marker');
          markerElement.setAttribute('data', [rowIndex, markerIndex]);

          container.appendChild(markerElement);
        });
      });
    };

    const disableClick = () => {
      const markers = document.querySelectorAll('.marker');
      markers.forEach((marker) => {
        marker.classList.add('disabled');
      });
    };

    return {
      getCurrentPlayer,
      addMarker,
      getWinner,
      restart,
      render,
      disableClick,
    };
  })();

  let playerOneName = null;
  let playerTwoName = null;

  do {
    playerOneName = prompt('Enter Player 1 name:');
  } while (playerOneName == null || playerOneName.length == 0);

  do {
    playerTwoName = prompt('Enter Player 2 name:');
  } while (playerTwoName == null || playerTwoName.length == 0);

  player.add(playerOneName, 'X');
  player.add(playerTwoName, 'O');
  player.displayCurrentPlayer(gameboard.getCurrentPlayer());

  gameboard.render();

  const markers = document.querySelectorAll('.marker');

  markers.forEach((marker) => {
    marker.addEventListener('click', (e) => {
      const pos = marker.getAttribute('data');
      const markerPosition = pos.split(',').map((x) => parseInt(x));
      const markerAdded = gameboard.addMarker(markerPosition);
      marker.textContent = markerAdded;
      player.displayCurrentPlayer(gameboard.getCurrentPlayer());

      const winner = gameboard.getWinner();
      if (winner !== null) {
        player.displayWinner(winner);
        gameboard.disableClick();
      }
    });
  });

  const restartBtn = document.querySelector('#restart');

  restartBtn.addEventListener('click', () => {
    gameboard.restart();
    player.displayCurrentPlayer(gameboard.getCurrentPlayer());
  });
})();
