import React, { Component } from "react";
import "../css/Node.css";

export default class Node extends Component {
  render() {
    const {
      isStart,
      isFinish,
      isWall,
      row,
      col,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      isKey,
      keyClass
    } = this.props;

    // Figure out the type of the node
    let classNames = `node node-shadow`;
    classNames += isStart ? ` node-start` : ``;
    classNames += isFinish ? ` node-finish` : ``;
    classNames += isWall ? ` node-wall` : ``;

    // Add specific class if the node is part of the Key/Legend
    if (isKey) {
      return <div className={`node node-shadow ${keyClass}`}></div>;
    }

    return (
      <div 
        id = {`row-${row}-col-${col}`}
        onMouseDown = {() => onMouseDown(row, col)}
        onMouseEnter = {() => onMouseEnter(row, col)}
        onMouseUp = {() => onMouseUp(row, col)}
        className = {classNames}
      ></div>
    );
  }
}