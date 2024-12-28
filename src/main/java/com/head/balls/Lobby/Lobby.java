package com.head.balls.Lobby;

import com.head.balls.Auth.Auth;

public class Lobby {
  
  private String host = "";
  private String noob = "";


  Lobby(String host) {
    this.host = host;
  }

  //Getters
  public String getHost() {
    return host;
  }

  public String getNoob() {
    return noob;
  }

  //Users
  public void join(String username) {
    //Lobby is full
    if (isFull())
      throw new RuntimeException("Lobby is already full");

    //User is already in the lobby
    if (contains(username))
      throw new RuntimeException("User is already in the lobby");

    //Join
    noob = username;
  }

  public boolean contains(String username) {
    return host.equals(username) || noob.equals(username);
  }

  public boolean isFull() {
    return !host.equals("") && !noob.equals("");
  }

  public boolean isActive() {
    try {
      return Auth.getUser(host).isOnline() && Auth.getUser(noob).isOnline();
    } catch (Exception e) {
      return false;
    }
  }
}