package kz.nabrk.nabrkoauth2server.configs.hibernate;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategy;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

import java.io.Serializable;

public class CustomPhysicalNamingStrategyImpl implements PhysicalNamingStrategy, Serializable {

    public static final CustomPhysicalNamingStrategyImpl INSTANCE = new CustomPhysicalNamingStrategyImpl();

    @Override
    public Identifier toPhysicalCatalogName(final Identifier name, final JdbcEnvironment context) {

        return new Identifier(name.getText(), true);
    }

    @Override
    public Identifier toPhysicalSchemaName(final Identifier name, final JdbcEnvironment context) {

        return new Identifier(name.getText(), true);
    }

    @Override
    public Identifier toPhysicalTableName(final Identifier name, final JdbcEnvironment context) {

        return new Identifier(name.getText(), true);
    }

    @Override
    public Identifier toPhysicalSequenceName(final Identifier name, final JdbcEnvironment context) {

        return new Identifier(name.getText(), true);
    }

    @Override
    public Identifier toPhysicalColumnName(final Identifier name, final JdbcEnvironment context) {

        return new Identifier(name.getText(), true);
    }
}
