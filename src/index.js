import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
	render() {
		return (
				<button
					className="square"
					onClick={() => this.props.onClick()}
				>
					{this.props.value}
				</button>
		);
	}
}

class Board extends React.Component {
	// Важный ВЫВОД:
	// Теперь когда компонент Board хранит состояние и передаёт его в виде пропов в дочерние компоненты Square, он становится
	// для них ИСТОЧНИКОМ ИСТИНЫ. Более того компонент Board в виде пропа также передаёт коллбэк, который дочерний компонент
	// должен вызывать каждый раз в ответ на определённое событие, извещая родительский компонент Board о том, что в нём что-то произошло.
	// Получается, что компонент Board КОНТРОЛИРУЕТ компоненты Square:
	// - определяет, ЧТО им рисовать;
	// - требует от них СООБЩАТЬ о действиях в них.
	// то есть имеет полный контроль над ними!
	// Компоненты Square в данной ситуации называются КОНТРОЛИРУЕМЫМИ!
	constructor(props) {
		super(props);
		this.state = {
			squaresValues: Array(9).fill(null),
		}
	}

	handleClick(i) {
		// 2 варианта того, как заменить / добавить элемент в массив
		// 1) Вариант "в лоб":
		const newSquaresValues = this.state.squaresValues.slice();
		newSquaresValues[i] = 'X';
		this.setState({
			squaresValues: newSquaresValues,
		});
		// 2) модный вариант на spread-операторах и варианте setState, принимающим стрелочный коллбэк с прошлым стейтом)
		// this.setState((prevState) => {
		// 	return {
		// 		squaresValues: [
		// 			...prevState.squaresValues.slice(0, i),
		// 			'X',
		// 			...prevState.squaresValues.slice(i + 1),
		// 		],
		// 	}
		// });
	}

	renderSquare(i) {
		return (
			<Square
				value={this.state.squaresValues[i]}
				onClick={() => this.handleClick(i)}
			/>
			)

	}

	render() {
		const status = 'Next player: X';

		return (
				<div>
					<div className="status">{status}</div>
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

class Game extends React.Component {
	render() {
		return (
				<div className="game">
					<div className="game-board">
						<Board />
					</div>
					<div className="game-info">
						<div>{/* status */}</div>
						<ol>{/* TODO */}</ol>
					</div>
				</div>
		);
	}
}

// ========================================

ReactDOM.render(
		<Game />,
		document.getElementById('root')
);

// Рассмотрим как именно Babel транспилирует JSX в обычный JS
// JSX:
// <div className="shopping-list">
// 	<h1>Shopping List for {this.props.name}!</h1>
// 	<ul>
// 		<li>Instagram</li>
// 		<li>WhatsApp</li>
// 		<li>Oculus</li>
// 	</ul>
// </div>

// JS:
// 1) Для каждого "кирпичика" / React-элемента вызывается React.createElement,где
// React.createElement(
// 1.1) 1-ый аргумент - тип тэга в формате string
// 		'div',
// 1.2) 2-ой аргумент может принимать 2 значения:
// 1.2.1) Если у React-элемента ЕСТЬ атрибуты / пропы, то здесь будет объект с парами "ПРОП: ЗНАЧЕНИЕ"
// 		{
// 			className: 'shopping-list',
// 		},
// 		React.createElement(
// 				'h1',
// 1.2.2) Если у React-элемента НЕТ атрибутов / пропов, то здесь будет NULL
// 				null,
// 1.3) 3-ий аргумент это CHILDREN / потомок / некий дочерний контент (это может быть как React-элемент, так и простой текст, так выражение, которое
// что-то возвращает). Если в рамках CHILDREN элемента есть несколько разных типов, то они разделяются ',' (как в этом примере).
// 				'Shopping List for',
// 				this.props.name,
// 				'!',
// 		),
// 		React.createElement(
// 				'ul',
// 				null,
// 				React.createElement(
// 						'li',
// 						null,
// 						'Instagram',
// 				),
// 				React.createElement(
// 						'li',
// 						null,
// 						'WhatsApp',
// 				),
// 				React.createElement(
// 						'li',
// 						null,
// 						'Oculus',
// 				),
// 		)
// 		)