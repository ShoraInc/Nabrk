package kz.nabrk.nabrkoauth2server.models.artifact;

import javassist.bytecode.ByteArray;
import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "`READER`")
public class AppReader {
    @Id
    @Column(name = "`USER_NAME`", nullable = false, length = 255)
    String userName;

    @Column(name = "`READER_STATUS_ID`", nullable = false, length = 5)
    Short readerStatusId;

    @Column(name = "`BAR_CODE`", nullable = false, length = 13)
    String barCode;

    @Column(name = "`FIRST_NAME`", nullable = false, length = 100)
    String firstName;

    @Column(name = "`LAST_NAME`", length = 100)
    String lastName;

    @Column(name = "`MIDDLE_NAME`", length = 100)
    String middleName;

    //    @Column(name = "`EMAIL`", length = 100)
    @Column(name = "`EMAIL`")
    private String email;
//    String email;

    @Column(name = "`ID_CARD_NUMBER`", length = 30)
    String idCardNumber;

    @Column(name = "`GENDER_ID`", length = 5)
    Short genderId;

    @Column(name = "`YEAR_OF_BIRTH`", length = 5)
    Short yearOfBirth;

    @Lob
    @Column(name = "`PHOTO`")
    @Type(type = "org.hibernate.type.BinaryType")
    private byte[] photo;
//    @Column(name = "`PHOTO`", length = 1048576)
//    Object photo;

    @Column(name = "`SUBSCRIPTION`", length = 5)
    Short subscription;

    @Column(name = "`NOTE`", length = 100)
    String note;

    @Column(name = "`HOME_ADDRESS`", length = 100)
    String homeAddress;

    @Column(name = "`REG_ADDRESS`", length = 100)
    String regAddress;

    @Column(name = "`HOME_PHONE`", length = 30)
    String homePhone;

    @Column(name = "`MOBILE_PHONE`", length = 30)
    String mobilePhone;

    @Column(name = "`NATIONALITY_ID`", length = 5)
    Short nationalityId;

    @Column(name = "`EDUCATION_TYPE_ID`", length = 5)
    Short educationTypeId;

    @Column(name = "`SOCIAL_STATUS_GROUP_ID`", length = 5)
    Short socialStatusGroupId;

    @Column(name = "`SOCIAL_STATUS_ID`", length = 5)
    Short socialStatusId;

    @Column(name = "`USER_GROUP_CN`", length = 100)
    String userGroupCn;

    @Column(name = "`JOB`", length = 100)
    String job;

    @Column(name = "`JOB_POSITION`", length = 100)
    String jobPosition;

    @Column(name = "`WORK_PHONE`", length = 30)
    String workPhone;

    @Column(name = "`ACADEMIC_DEGREE_ID`", length = 5)
    Short academicDegreeId;

    @Column(name = "`ACADEMIC_TITLE_ID`", length = 5)
    Short academicTitleId;

    @Column(name = "`PLACE_OF_STUDY`", length = 100)
    String placeOfStudy;

    @Column(name = "`FACULTY`", length = 100)
    String faculty;

    @Column(name = "`COURSE`", length = 20)
    String course;

    @Column(name = "`EMP_UID`", length = 50)
    String empUid;

    @Column(name = "`REGISTRATION_DATE`", nullable = false, length = 10)
    Date  registrationDate;

    @Column(name = "`REGISTRATION_TIME`", nullable = false, length = 8)
    Time  registrationTime;

    @Column(name = "`EDITING_DATE`", length = 10)
    Date  editingDate;

    @Column(name = "`EDITING_TIME`", length = 8)
    Time  editingTime;

    @Column(name = "`PRINTS_NUMBER`", length = 5)
    Short printsNumber;

}
