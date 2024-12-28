package com.head.balls.Auth;

import java.util.Date;

public class User extends UserCredentials {
  
  private long lastSeen = 0;
  public static final long timeoutDuration = 10000L; //10s


  public User(String username, String password) {
    super(username, password);
  }

  public User(UserCredentials user) {
    super(user.username, user.password);
  }

  public User(User user) {
    super(user.username, user.password);
  }

  //Online check
  public void notifyOnline() {
    lastSeen = new Date().getTime();
  }

  public void notifyOffline() {
    lastSeen = 0;
  }

  public long idleTime() {
    return new Date().getTime() - lastSeen;
  }

  public boolean isOnline() {
    return idleTime() < timeoutDuration;
  }
}
