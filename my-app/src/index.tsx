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

class Game extends React.Component<{}, { history: any, xIsNext: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
        }
    }

    handleClick(i: number) {
        const history = this.state.history;
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
        })
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = determineWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }


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
                    <ol>{/* TODO */}</ol>
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
