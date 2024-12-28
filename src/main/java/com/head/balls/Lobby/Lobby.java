package com.head.balls.Lobby;

public class Lobby {
  
  private String host = "";
  private String noob = "";


  Lobby(String host) {
    this.host = host;
  }

  //Users
  void join(String username) {
    //Lobby is full
    if (isFull())
      throw new RuntimeException("Lobby is already full");

    //User is already in the lobby
    if (contains(username))
      throw new RuntimeException("User is already in the lobby");

    //Join
    noob = username;
  }

  boolean contains(String username) {
    return host.equals(username) || noob.equals(username);
  }

  boolean isFull() {
    return !host.equals("") && !noob.equals("");
  }

  boolean isHost(String username) {
    return host.equals(username);
  }
}
