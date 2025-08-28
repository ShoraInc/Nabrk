package kz.nabrk.nabrkoauth2server.repository.artifact;

import kz.nabrk.nabrkoauth2server.models.artifact.AppReader;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface AppReaderRepository extends CrudRepository<AppReader, String> {
    Optional<AppReader> findByEmail(@Param("email") String email);

    Optional<AppReader> findByUserName(String userName);

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);

    @Query(value = "select nextval('reader_seq')", nativeQuery = true)
    BigDecimal getNextVal();
}
