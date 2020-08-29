import React , {Component } from "react";
import Node from './Node';
import "../css/Key.css";

export default class Key extends Component {
  render() {
    return (
      <ul className="key">
        <li>
          <Node isKey={true} keyClass="node-start-key"></Node>
          <span className="key-align">Start</span>
        </li>
        <li>
          <Node isKey={true} keyClass="node-finish-key"></Node>
          <span className="key-align">Target</span>
        </li>
        <li>
          <Node isKey={true} keyClass="node-unvisited-key"></Node>
          <span className="key-align">Unvisited</span>
        </li>
        <li>
          <Node isKey={true} keyClass="node-visited-key"></Node>
          <span className="key-align">Visited</span>
        </li>
        <li>
          <Node isKey={true} keyClass="node-path-key"></Node>
          <span className="key-align">Path</span>
        </li>
        <li>
          <Node isKey={true} keyClass="node-wall-key"></Node>
          <span className="key-align">Wall</span>
        </li>
      </ul>
    );
  }
}