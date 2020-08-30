import React, { Component } from "react";
import { withGetScreen } from "react-getscreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";

import { FaPlay } from 'react-icons/fa';
import { FaTools } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { FaSyncAlt } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';

import "../css/Field.css";
import  Node from "./Node";
import Key from "./Key";
import { BreadthFirstSearch } from "../algorithms/BreadthFirstSearch";
import { DepthFirstSearch } from "../algorithms/DepthFirstSearch";

const widthBreakPoint = 1000;

class Field extends Component {

  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      rowSize: 0,
      colSize: 0,
      startNodeCoords: { row: 0, col: 0},
      finishNodeCoords: { row: 0, col: 0},
      prevNode: { row: 0, col: 0},
      mouseDown: false,
      screenWidth: null,
      isRunning: false,
      canReset: true,
      algorithmTitle: "",
      totalVisNodes: 0,
      shortestDistance: 0
    };
    this.grid = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.initaliseScreen();
    });
    this.initaliseScreen();
  };

  // handling BreadthFirstSearch algorithm
  handleBreadthFirstSearch = () => {
    this.setState(
      {
        isRunning: true,
        canReset: false
      },
      () => {
        const { grid, startNodeCoords, finishNodeCoords } = this.state;
        const startNode = grid[startNodeCoords.row][startNodeCoords.col];
        const finishNode = grid[finishNodeCoords.row][finishNodeCoords.col];
        const visitedNodes = BreadthFirstSearch(startNode, finishNode, grid);
        this.animateSearch(visitedNodes, finishNode);
      }
    );
  };

  // handling DepthFirstSearch algorithm
  handleDepthFirstSearch = () => {
    this.setState(
      {
        isRunning: true,
        canReset: false
      },
      () => {
        const { grid, startNodeCoords, finishNodeCoords } = this.state;
        const startNode = grid[startNodeCoords.row][startNodeCoords.col];
        const finishNode = grid[finishNodeCoords.row][finishNodeCoords.col];
        const visitedNodes = DepthFirstSearch(startNode, finishNode, grid);
        this.animateSearch(visitedNodes, finishNode);
      }
    );
  };

  // animating the searching process
  animateSearch = (visitedNodes, finishNode) => {
    for(let i=0; i<=visitedNodes.length; i++){
      if(i === visitedNodes.length){
        setTimeout(() => {
          if(finishNode !== null) {
            this.setState({
              totalVisNodes: visitedNodes.length
            });
          }
          this.animatePath(finishNode);
        }, 30 * i);
        return;
      }
      setTimeout(() => {
        const{ row, col } = visitedNodes[i];
        document
        .getElementById(`row-${row}-col-${col}`)
        .classList.add("node-visited");
      }, 30 * i);
    }
    
  };
  // finding and animating final path
  animatePath = (finishNode) => {
    if(!finishNode.isVisited){
      this.setState({canReset: true});
      return;
    }
    // finding shortest path using recursion
    let shortestPath = []    
    let curNode = finishNode;
    while(curNode !== null){
      shortestPath.push(curNode);
      curNode = curNode.prevNode;
    }
    shortestPath.reverse();

    // animate path
    for(let i=0; i<=shortestPath.length; i++){
      if(i === shortestPath.length){
        setTimeout(() => {
          if(finishNode !== null) {
            this.setState({
              shortestDistance: finishNode.distance
            });
          }
          this.setState({canReset: true});
        }, 50 * i);
        return;
      }
      setTimeout(() => {
        const { row, col } = shortestPath[i];
        document
          .getElementById(`row-${row}-col-${col}`)
          .classList.add("node-path");
      }, 50 * i);
    }
  };

  // initalise grid according to avaialble screen
  initaliseScreen = () => {
    let curScreenWidth = window.innerWidth;
    const columns = this.grid.current.childNodes; // get iterable list of columns
    for (const column of columns) {
      // this returns HTML DOM elements with className = "column"
      for (const node of column.childNodes) {
        // iterate through the nodes in the DOM tree of the column
        node.classList.remove(`node-path`);
        node.classList.remove(`node-visited`);
      }
    }    
    let rowSize, colSize, width, height;
    width = window.innerWidth;
    height = window.innerHeight;
    if(curScreenWidth >= widthBreakPoint){
      rowSize = Math.floor((height * 0.75) / 30);
      colSize = Math.floor((width * 0.70) / 30);
    }
    else{
      rowSize = Math.floor((height * 0.70) / 30);
      colSize = Math.floor((width * 0.90) / 30);
    }
    

    if(rowSize < 1) rowSize = 1;
    if(colSize < 1) colSize = 1;
    
    this.setState({
      rowSize,
      colSize
    });
    this.createGrid(rowSize, colSize);
  };

  // create a grid
  createGrid = (rowSize, colSize) => {
    let startNode = { row: 0, col: 0}, finishNode = { row: 0, col: 0};
    startNode = this.generateRandomNode(0, rowSize, 0, 5);
    finishNode = this.generateRandomNode(0, rowSize, colSize-5, colSize);
    let grid = [];
    for(let i=0; i<rowSize; i++){
      let curRow = [];
      for(let j=0;j<colSize; j++){
        curRow.push(this.createNode(i,j));
      }
      grid.push(curRow);
    }
    this.setStartAndFinishNodes(grid, startNode, finishNode);
    this.setState({
      grid,
      startNodeCoords: { row: startNode.row, col: startNode.col },
      finishNodeCoords: { row: finishNode.row, col: finishNode.col }
    });
  };

  // create a node
  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: false,
      isFinish: false,
      isVisited: false,
      isWall: false,
      prevNode: null,
      distance: Infinity
    };
  };

  // set start and finish nodes
  setStartAndFinishNodes = (grid, startNode, finishNode) => {
    grid[startNode.row][startNode.col].isStart = true;
    grid[finishNode.row][finishNode.col].isFinish = true;
  };

  // random initalization of a node with given ranges
  generateRandomNode = (startRow, endRow, startCol, endCol) => {
    let randomRow = Math.floor( Math.random() * (endRow - startRow)) + 1;
    let randomCol = Math.floor( Math.random() * (endCol - startCol)) + 1;
    let row = endRow - randomRow, col = endCol - randomCol ;
    return {  row, col } ;
  }

  // generating random walls
  generateWalls = (grid) => {
    const rowSize = grid.length, colSize = grid[0].length;
    for(let i=0; i<rowSize; i++){
      for(let j=0; j<colSize; j++){
          if(Math.random() * 10 > 9){
            if(grid[i][j].isStart || grid[i][j].isFinish) continue;
            grid[i][j].isWall = true;
          }
      }
    }
    this.setState({ grid });
  }
  // clearing all walls
  clearWalls = (grid) => {
    const rowSize = grid.length, colSize = grid[0].length;
    for(let i=0; i<rowSize; i++){
      for(let j=0; j<colSize; j++){
          if(grid[i][j].isWall) grid[i][j].isWall = false;
      }
    }
    this.setState({ grid });
  }

  // handling mouse events to add or remove walls or change start, end positions
  handleMouseUp = (row, col) => {
    const {
      grid,
      mouseDown,
      isRunning,
      isStartMoving,
      isFinishMoving
    } = this.state;
    if(!mouseDown || isRunning) return;

    let curNode = grid[row][col];
    if(isStartMoving){
      curNode.isStart = true;
      curNode.isWall = false;
      this.setState({ 
        startNodeCoords: {row, col},
        prevNode: {row, col},
        isStartMoving: false
      });
    }
    else if(isFinishMoving){
      curNode.isFinish = true;
      curNode.isWall = false;
      this.setState({ 
        finishNodeCoords: {row, col},
        prevNode: {row, col},
        isFinishMoving: false
      });
    }
    else{
      curNode.isWall = !curNode.isWall;
    }
    this.setState({ mouseDown: false});
  }
  handleMouseEnter = (row, col) => {
    const {
      grid,
      prevNode,
      isRunning,
      mouseDown,
      isStartMoving,
      isFinishMoving
    } = this.state;
    if(!mouseDown || isRunning) return ;

    let curNode = grid[row][col];
    if(isStartMoving){
      console.log(this.state.startNodeCoords);
      curNode.isStart = true;
      grid[prevNode.row][prevNode.col].isStart = false;
      this.setState({ prevNode: {row, col}});
    }
    else if(isFinishMoving){
      curNode.isFinish = true;
      grid[prevNode.row][prevNode.col].isFinish = false;
      this.setState({ prevNode: {row, col}});
    }
    else{
      curNode.isWall = !curNode.isWall;
    }
    
    this.setState({ mouseDown: true});
  }
  handleMouseDown = (row, col) => {
    const { grid, isRunning } = this.state;
    if(isRunning) return ;

    let curNode = grid[row][col];
    if(curNode.isStart){
      curNode.isStart = false;
      this.setState({ isStartMoving: true, prevNode: {row, col}});
    }
    else if(curNode.isFinish){
      curNode.isFinish = false;
      this.setState({ isFinishMoving: true, prevNode: {row, col}});
    }
    this.setState({mouseDown: true});

  }

  // start implementing algorithem
  start = () => {
    let chosenAlgorithm = this.state.algorithmTitle;

    if (chosenAlgorithm === "BreadthFirstSearch") {
      this.handleBreadthFirstSearch();
    }
    else if (chosenAlgorithm === "DepthFirstSearch") {
      this.handleDepthFirstSearch();
    }
  };

  // choose an algorithem
  chooseAlgorithm = (name) => {
    this.setState({ algorithmTitle: name });
  };

  // reset grid
  resetNodes = () => {
    const columns = this.grid.current.childNodes; // get iterable list of columns
    for (const column of columns) {
      // this returns HTML DOM elements with className = "column"
      for (const node of column.childNodes) {
        // iterate through the nodes in the DOM tree of the column
        node.classList.remove(`node-path`);
        node.classList.remove(`node-visited`);
      }
    }

    this.initaliseScreen();
    this.setState({
      isRunning: false,
      visitedNodes: 0,
      totalVisNodes: 0,
      shortestDistance: 0
    });
  };

  render() {
    const { grid } = this.state;
    let curScreenWidth = window.innerWidth;

    // storing common HTML code in variables
    let gridScreen = 
      <div className = "grid" ref = {this.grid}>
      {grid.map((row, rowIdx) => {
        return (
          <div key={rowIdx}>
            {row.map((node, nodeIdx) => {
              const {
                row,
                col,
                isStart,
                isFinish,
                isWall,
                isVisited,
              } = node;
              const { colSize } = this.state;
              return (
                <Node
                  key = {rowIdx * colSize + nodeIdx}
                  row = {row}
                  col = {col}
                  isStart = {isStart}
                  isFinish = {isFinish}
                  isWall = {isWall}
                  isVisited = {isVisited}
                  onMouseDown={this.handleMouseDown}
                  onMouseUp={this.handleMouseUp}
                  onMouseEnter={this.handleMouseEnter}
                ></Node>
              );
            })}
          </div>                
        );
      })}
    </div> ;

    let algoDropdown = 
      <Nav>
        <NavDropdown className = "mr-2 pull-right" title={this.state.algorithmTitle || "Choose Algo"} 
          id="collasible-nav-dropdown">
          <NavDropdown.Item 
            onClick = {() => this.chooseAlgorithm("BreadthFirstSearch")}
            active = {this.state.algorithmTitle === "BreadthFirstSearch"}
            href="#">Breadth First Search</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item 
            onClick = {() => this.chooseAlgorithm("DepthFirstSearch")}
            active = {this.state.algorithmTitle === "DepthFirstSearch"}
            href="#">Depth First Search</NavDropdown.Item>
        </NavDropdown>
      </Nav> ;
    
    // if screen is a laptop
    if(curScreenWidth >= widthBreakPoint){
      return (
        <>
          <Navbar className="navbar customNavbar" collapseOnSelect expand="lg" variant="dark" bg="dark" sticky="top" >
            <Navbar.Brand href="#">PathFinder</Navbar.Brand>
  
            {algoDropdown}
  
            <Nav className = "mr-auto">
              <Button className = "mr-sm-2" variant="success"
                onClick = {this.start} disabled={this.state.isRunning || this.state.algorithmTitle === ""}
              >
                <FaPlay /> Start
              </Button>
  
              <Button className = "mr-sm-2" variant="warning"
                onClick = {() => this.generateWalls(grid)} disabled={this.state.isRunning}
              >
                <FaTools /> Build Walls
              </Button>
  
              <Button className = "mr-sm-2" variant="secondary"
                onClick = {() => this.clearWalls(grid)} disabled={this.state.isRunning}
              >
                <FaTimesCircle /> Clear Walls
              </Button>
              <Button className = "mr-sm-2" variant="danger"
                onClick = {this.resetNodes} disabled={!this.state.canReset}
              >
                <FaSyncAlt /> Reset
              </Button>
            </Nav>
            <Nav>
              <Nav.Link href="#"><FaGithub size="30"/></Nav.Link>
            </Nav>
          </Navbar>
  
          <div className = "mainContainer">
          <div className = "gridInfo">
            {gridScreen}
          </div>
          <div className = "algoInfo">
            <div className = "customCard" style={{color: "#008080"}}>
              <div className="outputTextStyle">Visited</div>
              <div className="outputCountStyle">{this.state.totalVisNodes}</div>
            </div>
            <div className = "customCard" style={{color: "#cccc00"}}>
              <div className="outputTextStyle">Shortest Path</div>
              <div className="outputCountStyle">{this.state.shortestDistance}</div>
            </div>
          </div>
          </div>

          <Key />
  
        </>
      );
    }
    
    // if screen is a mobile
    else{
      return (
        <>
          <Navbar className="navbar customNavbar" collapseOnSelect variant="dark" bg="dark" sticky="top" >
  
            <Nav className = "mr-auto">
              <Button className = "mr-2" variant="success"
                onClick = {this.start} disabled={this.state.isRunning || this.state.algorithmTitle === ""}
              >
                <FaPlay />
              </Button>
  
              <Button className = "mr-2" variant="warning"
                onClick = {() => this.generateWalls(grid)} disabled={this.state.isRunning}
              >
                <FaTools />
              </Button>
  
              <Button className = "mr-2" variant="secondary"
                onClick = {() => this.clearWalls(grid)} disabled={this.state.isRunning}
              >
                <FaTimesCircle />
              </Button>
              <Button className = "mr-2" variant="danger"
                onClick = {this.resetNodes} disabled={!this.state.canReset}
              >
                <FaSyncAlt />
              </Button>
            </Nav>
            
            {algoDropdown}
            
          </Navbar>
  
          <div style={{marginTop: "2vh"}}>
            {gridScreen}
          </div>  

          <div className = "algoInfo">
            <div className = "customCard" style={{color: "#008080"}}>
              <div className="outputTextStyle">Visited</div>
              <div className="outputCountStyle">{this.state.totalVisNodes}</div>
            </div>
            <div className = "customCard" style={{color: "#cccc00"}}>
              <div className="outputTextStyle">Shortest Path</div>
              <div className="outputCountStyle">{this.state.shortestDistance}</div>
            </div>
          </div>     
  
        </>
      );
    }    
  }
}

export default withGetScreen(Field);