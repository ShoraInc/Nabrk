package kz.nabrk.nabrkoauth2server.models.artifact;

public class MdReader extends AbstractArtifactMdConverter {
    public String getClassName() {
        return "AppReader";
    }
    public String getDbTableName() {
        return "READER";
    }

    public String getColumnsStr() {
        return "    public final StringColumn<MDReader> USER_NAME = new StringColumn(this, \"USER_NAME\", true, false, 255, 0, false);\n" +
                "    public final ShortColumn<MDReader> READER_STATUS_ID = new ShortColumn(this, \"READER_STATUS_ID\", false, false, 5, 0, false);\n" +
                "    public final StringColumn<MDReader> BAR_CODE = new StringColumn(this, \"BAR_CODE\", false, false, 13, 0, false);\n" +
                "    public final StringColumn<MDReader> FIRST_NAME = new StringColumn(this, \"FIRST_NAME\", false, false, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> LAST_NAME = new StringColumn(this, \"LAST_NAME\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> MIDDLE_NAME = new StringColumn(this, \"MIDDLE_NAME\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> EMAIL = new StringColumn(this, \"EMAIL\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> ID_CARD_NUMBER = new StringColumn(this, \"ID_CARD_NUMBER\", false, true, 30, 0, false);\n" +
                "    public final ShortColumn<MDReader> GENDER_ID = new ShortColumn(this, \"GENDER_ID\", false, true, 5, 0, false);\n" +
                "    public final ShortColumn<MDReader> YEAR_OF_BIRTH = new ShortColumn(this, \"YEAR_OF_BIRTH\", false, true, 5, 0, false);\n" +
                "    public final ByteArrayColumn<MDReader> PHOTO = new ByteArrayColumn(this, \"PHOTO\", false, true, 1048576, 0, false);\n" +
                "    public final ShortColumn<MDReader> SUBSCRIPTION = new ShortColumn(this, \"SUBSCRIPTION\", false, true, 5, 0, false);\n" +
                "    public final StringColumn<MDReader> NOTE = new StringColumn(this, \"NOTE\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> HOME_ADDRESS = new StringColumn(this, \"HOME_ADDRESS\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> REG_ADDRESS = new StringColumn(this, \"REG_ADDRESS\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> HOME_PHONE = new StringColumn(this, \"HOME_PHONE\", false, true, 30, 0, false);\n" +
                "    public final StringColumn<MDReader> MOBILE_PHONE = new StringColumn(this, \"MOBILE_PHONE\", false, true, 30, 0, false);\n" +
                "    public final ShortColumn<MDReader> NATIONALITY_ID = new ShortColumn(this, \"NATIONALITY_ID\", false, true, 5, 0, false);\n" +
                "    public final ShortColumn<MDReader> EDUCATION_TYPE_ID = new ShortColumn(this, \"EDUCATION_TYPE_ID\", false, true, 5, 0, false);\n" +
                "    public final ShortColumn<MDReader> SOCIAL_STATUS_GROUP_ID = new ShortColumn(this, \"SOCIAL_STATUS_GROUP_ID\", false, true, 5, 0, false);\n" +
                "    public final ShortColumn<MDReader> SOCIAL_STATUS_ID = new ShortColumn(this, \"SOCIAL_STATUS_ID\", false, true, 5, 0, false);\n" +
                "    public final StringColumn<MDReader> USER_GROUP_CN = new StringColumn(this, \"USER_GROUP_CN\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> JOB = new StringColumn(this, \"JOB\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> JOB_POSITION = new StringColumn(this, \"JOB_POSITION\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> WORK_PHONE = new StringColumn(this, \"WORK_PHONE\", false, true, 30, 0, false);\n" +
                "    public final ShortColumn<MDReader> ACADEMIC_DEGREE_ID = new ShortColumn(this, \"ACADEMIC_DEGREE_ID\", false, true, 5, 0, false);\n" +
                "    public final ShortColumn<MDReader> ACADEMIC_TITLE_ID = new ShortColumn(this, \"ACADEMIC_TITLE_ID\", false, true, 5, 0, false);\n" +
                "    public final StringColumn<MDReader> PLACE_OF_STUDY = new StringColumn(this, \"PLACE_OF_STUDY\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> FACULTY = new StringColumn(this, \"FACULTY\", false, true, 100, 0, false);\n" +
                "    public final StringColumn<MDReader> COURSE = new StringColumn(this, \"COURSE\", false, true, 20, 0, false);\n" +
                "    public final StringColumn<MDReader> EMP_UID = new StringColumn(this, \"EMP_UID\", false, true, 50, 0, false);\n" +
                "    public final DateColumn<MDReader> REGISTRATION_DATE = new DateColumn(this, \"REGISTRATION_DATE\", false, false, 10, 0, false);\n" +
                "    public final TimeColumn<MDReader> REGISTRATION_TIME = new TimeColumn(this, \"REGISTRATION_TIME\", false, false, 8, 0, false);\n" +
                "    public final DateColumn<MDReader> EDITING_DATE = new DateColumn(this, \"EDITING_DATE\", false, true, 10, 0, false);\n" +
                "    public final TimeColumn<MDReader> EDITING_TIME = new TimeColumn(this, \"EDITING_TIME\", false, true, 8, 0, false);\n" +
                "    public final ShortColumn<MDReader> PRINTS_NUMBER = new ShortColumn(this, \"PRINTS_NUMBER\", false, true, 5, 0, false);\n";
    }

}
