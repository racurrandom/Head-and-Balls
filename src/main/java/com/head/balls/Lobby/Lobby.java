package com.head.balls.Lobby;

public class Lobby {
  
  public String host;
  public String noob;

  Lobby(String host, String noob) {
    this.host = host;
    this.noob = noob;
  }

  boolean contains(String username) {
    return host.equals(username) || noob.equals(username);
  }
}
