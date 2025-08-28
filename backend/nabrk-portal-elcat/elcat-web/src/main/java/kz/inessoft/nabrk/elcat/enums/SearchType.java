package kz.inessoft.nabrk.elcat.enums;

public enum SearchType {
    SIMPLE((short) 1),
    ADVANCED((short) 2),
    FULLTEXT((short) 3),
    UDC((short) 4);

    private final short value;

    SearchType(short value) {
        this.value = value;
    }

    public short getValue() {
        return value;
    }

    public static SearchType getFromValue(short value) {
        switch (value) {
            case 1: return SIMPLE;
            case 2: return ADVANCED;
            case 3: return FULLTEXT;
            case 4: return UDC;
            default: throw new IllegalArgumentException("SearchType with value " + value + " does not supported");
        }
    }
}
