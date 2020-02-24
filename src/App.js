import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase.js";
class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: "",
      username: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    console.log(this.state);
    e.preventDefault();
    const itemsRef = firebase.database().ref("newitems");
    const itemsRef1 = firebase.database().ref("person");
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    };
    itemsRef.push(item);
    this.setState({
      currentItem: "",
      username: ""
    });
    console.log("newstate..", this.state);
    itemsRef1.set({
      name: "Casper",
      age: "22"
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentDidMount() {
    const itemsRef1 = firebase.database().ref("person");
    itemsRef1.on("value", snapshot => {
      let personItems = snapshot.val();
      console.log("personitems", personItems);
    });
    //component that gets loaded as the application is loaded
    const itemsRef = firebase.database().ref("newitems");
    itemsRef.on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];

      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }

      this.setState({
        items: newState.map(item => {
          return (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>brought by: {item.user}</p>
              <button onClick={() => this.removeItem(item.id)}>
                Remove Item
              </button>
            </li>
          );
        })
      });

      console.log("newstate", this.state);
    });
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/newitems/${itemId}`);
    itemRef.remove();
  }

  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="What's your name?"
                onChange={this.handleChange}
                value={this.state.username}
              />
              <input
                type="text"
                name="currentItem"
                placeholder="What are you bringing?"
                onChange={this.handleChange}
                value={this.state.currentItem}
              />
              <button>Add Item</button>
            </form>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>{this.state.items}</ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
