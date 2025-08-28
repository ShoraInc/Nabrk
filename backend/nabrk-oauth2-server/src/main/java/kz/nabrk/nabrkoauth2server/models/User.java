package kz.nabrk.nabrkoauth2server.models;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "`APP_USERS`",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "`USER_NAME`"),
                @UniqueConstraint(columnNames = "`EMAIL`")
        })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`ID`", nullable = false)
    private Long id;

    @Column(name = "`USER_NAME`")
    private String userName;

    @Column(name = "`EMAIL`")
    private String email;

    @Column(name = "`PASSWORD`")
    private String password;

    public User() {
    }

    public User(String userName, String email, String password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
    }

/*
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String username) {
        this.userName = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

*/
}
