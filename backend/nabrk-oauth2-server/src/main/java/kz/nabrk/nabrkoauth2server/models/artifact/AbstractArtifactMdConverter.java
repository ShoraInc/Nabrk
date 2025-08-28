package kz.nabrk.nabrkoauth2server.models.artifact;

import com.sun.istack.NotNull;
import kz.nabrk.nabrkoauth2server.utils.CaseConvertUtils;

import java.util.*;

abstract public class AbstractArtifactMdConverter {
    abstract String getColumnsStr();

    abstract String getClassName();

    abstract String getDbTableName();

    public String generateEntity() {
        return String.join("",
                new String[]{
                        "@Entity( name = \"`",
                        getDbTableName(),
                        "`\")\n",
                        "public class ",
                        getClassName(),
                        "{\n",
                        generateJpaColumns(),
                        "\n}"
                }
        );
    }

    public String generateJpaColumns() {
        List<String> class_ = new ArrayList<>();
        Arrays.stream(getColumnsStr().split("\n")).forEach(str -> {
            String rightSide = getSide(str, true);
            if (rightSide == null) {
                return;
            }
            class_.add(extractColumnStrJPA(rightSide));
            class_.add(extractColumnStrJAVA(rightSide));
            class_.add("");

        });
        return String.join("\n", class_);
    }


    private String extractColumnType(@NotNull String rightSide) {
        String mdTypeName = rightSide.replace("new", "").split("\\(")[0].trim();
        return columnMdJpaMapper(mdTypeName);
    }

    private String extractColumnStrJPA(@NotNull String rightSide) {
        boolean notNull = Boolean.parseBoolean(extractColumnNullable(rightSide));
        int columnSize = extractColumnSize(rightSide);
        String columnSizeStr = columnSize > 0 ? String.format(", size = %s", columnSize) : "";
        String[] res = new String[]{
                "@Column(name = \"`",
                extractColumnName(rightSide),
                "`\"",
                !notNull ? ", nullable = false" : "",
                columnSizeStr,
                ")",
        };
        return String.join("", res);
    }

    private String extractColumnStrJAVA(@NotNull String rightSide) {
        String[] res = new String[]{
                extractColumnType(rightSide),
                extractColumnNameCamelCase(rightSide),
                ";"
        };
        return String.join(" ", res);
    }

    private String extractColumnName(@NotNull String rightSide) {
        return getParameterValue(rightSide, 1)
                .replace("\"", "")
                .replace("\"", "")
                .trim();
    }

    private String extractColumnNameCamelCase(@NotNull String rightSide) {
        return CaseConvertUtils.toCamelCase(
                extractColumnName(rightSide)
        );
    }

    private int extractColumnSize(@NotNull String rightSide) {
        String res = getParameterValue(rightSide, 4);
        String digits = res != null ? res.replaceAll("\\D", "") : "0";
        return Integer.parseInt(!digits.equals("") ? digits : "0");
    }

    private String extractColumnIsPK(@NotNull String rightSide) {
        return getParameterValue(rightSide, 2);
    }

    private String extractColumnNullable(@NotNull String rightSide) {
        return getParameterValue(rightSide, 3);
    }

    private String extractColumnDecimalDigits(@NotNull String rightSide) {
        return getParameterValue(rightSide, 4);
    }

    private String extractColumnIsGenerated(@NotNull String rightSide) {
        return getParameterValue(rightSide, 6);
    }

    private String getParameterValue(@NotNull String str, @NotNull int orderIndex) {
        String[] params = parseParameters(str);
        return params != null && params.length + 1 >= orderIndex ? params[orderIndex].trim() : null;
    }

    private String[] parseParameters(@NotNull String str) {
        return str.contains("(") && str.contains(")")
                ? str.split("\\(")[1].split("\\)")[0].split(",")
                : null;
    }

    private String columnMdJpaMapper(String mdTypeName) {
        return mdTypeName.replace("Column", "");
    }

    static String getSide(@NotNull String str, boolean isRightSide) {
        String[] sides = str.split("=");
        return sides.length == 2 ? sides[isRightSide ? 1 : 0] : null;
    }
}
