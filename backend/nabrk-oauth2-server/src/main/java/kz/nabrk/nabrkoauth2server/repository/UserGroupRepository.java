package kz.nabrk.nabrkoauth2server.repository;

import kz.nabrk.nabrkoauth2server.models.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    List<UserGroup> findAllByUserName(String userName);

    Optional<UserGroup> findByUserNameAndUserGroup(String userName, String userGroup);
}
