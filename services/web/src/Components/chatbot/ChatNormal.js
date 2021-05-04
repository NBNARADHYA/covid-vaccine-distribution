import React, { Component } from "react";
import {  Widget,  addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import logo from "../../Images/avatar.jpeg";

class Chat extends Component {

  componentDidMount() {
    addResponseMessage('Hope you are fine. Feel free to ask me anything related to Covid-19. I will try my best to help you out.');    
  }

  handleNewUserMessage = newMessage => {
    this.postMes(newMessage);
  };

  postMes = text => {
    const req = {
      msg: text
    };    
     return fetch(`${process.env.REACT_APP_CHATBOT_SERVER}/bot`, {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    })
      .then(
        response => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            error.response = response;
            throw error;
          }
        },
        error => {
          throw error;
        }
      )
      .then(response => response.json())

      .then(res => {
          const {response} = res
          addResponseMessage(response);
      })
      .catch(error => {
        alert("\nError: " + error.message + "\n");
      });
  };
  render() {
    return (
      <div>
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          profileAvatar={logo}
          title="Covid Bot"
          subtitle="Ask anything related to Covid-19"
          badge
        />
      </div>
    );
  }
}

export default Chat;