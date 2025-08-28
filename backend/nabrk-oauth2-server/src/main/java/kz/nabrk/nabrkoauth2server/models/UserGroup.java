package kz.nabrk.nabrkoauth2server.models;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "`APP_USERS_GROUP`")
public class UserGroup {
    public UserGroup() {
    }

    public UserGroup(String userName, String userGroup) {
        this.userName = userName;
        this.userGroup = userGroup;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`ID`")
    Long id;

    @Column(name = "`USER_NAME`")
    String userName;

    @Column(name = "`USER_ROLE`")
    String userGroup;
}
