package com.head.balls.Auth;

import java.io.Serializable;

import com.head.balls.Messages;

public class UserCredentials implements Serializable {

  protected String username;
  protected String password;

  
  public UserCredentials(String username, String password) {
    this.username = username;
    this.password = password;
  }

  //Validation
  public void checkValid() {
    //Invalid username
    if (username == null) 
      throw new InvalidCredentialsException(Messages.usernameInvalid);

    //Invalid password
    if (password == null) 
      throw new InvalidCredentialsException(Messages.passwordInvalid);

    //Invalid username size
    if (username.length() < 1 || username.length() > 15)
      throw new InvalidCredentialsException(Messages.usernameLengthInvalid);

    //Invalid password size
    if (password.length() < 1 || password.length() > 15)
      throw new InvalidCredentialsException(Messages.passwordLengthInvalid);
  }

  //Getters & setters
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}
