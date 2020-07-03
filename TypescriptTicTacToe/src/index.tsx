import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

// ======================================================================================================================================================

// type squareProps = {
//     value: string,
//     onClick: any,
// }

// Old way of defining Square
// class Square extends React.Component<squareProps, { value: any }> { 
//     constructor(props: any) {
//         super(props);
//         this.state = {
//             value: this.props.value,
//         };
//     }


//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

// Functions are another way to define components but they don't have their own state (they use the public one)
function Square(props: any) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

// Class name extends react.component<props, stateValues> {}
class Board extends React.Component<{ squares: any, onClick: any }, { squares: any, xIsNext: boolean }> {
    renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

type gameState = {
    history: any,
    xIsNext: boolean,
    moveNo: number,
}

const initialGameState = {
    history: [{
        squares: Array(9).fill(null),
    }],
    xIsNext: true,
    moveNo: 0,
}

class Game extends React.Component<{}, gameState> {
    constructor(props: any) {
        super(props);
        this.state = {
            history: initialGameState.history,
            xIsNext: initialGameState.xIsNext,
            moveNo: initialGameState.moveNo,
        }
    }

    handleClick(i: number) {
        const history = this.state.history.slice(0, this.state.moveNo + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (determineWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            moveNo: history.length
        })
    }

    jumpTo(step: number) {
        this.setState({
            moveNo: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.moveNo];
        const winner = determineWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step: number, move: number) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                // Using the index as the key is normally discouraged, but as the move array isn't manipulated (other than appending new moves) its okay
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}
                    </button>
                </li>
            )
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i: number) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

function determineWinner(squares: number[]) {
    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i: number = 0; i < winningLines.length; i++) {
        const [a, b, c]: number[] = winningLines[i];
        const aIsNull: boolean = squares[a] === null;
        const aEqualsB: boolean = squares[a] === squares[b];
        const aEqualsC: boolean = squares[a] === squares[c];

        if (!aIsNull && aEqualsB && aEqualsC) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
