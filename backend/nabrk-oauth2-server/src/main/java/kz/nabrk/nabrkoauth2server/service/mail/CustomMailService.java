package kz.nabrk.nabrkoauth2server.service.mail;


import kz.nabrk.nabrkoauth2server.pojo.mail.Mail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CustomMailService {
    @Autowired
    MailService mailService;

    @Value("${spring.mail.username}")
    private String mailAccountUserName;

    public void sendRecoveryPassword(String userName, String consumerEmail, String consumerPassword) {
        StringBuilder msgBody = new StringBuilder();
        msgBody.append("Ваш пароль восстановлен.<br>");
        msgBody.append("Номер читательского билета: <b>");
        msgBody.append(userName);
        msgBody.append("</b><br>");
        msgBody.append("Ваш новый пароль <b>");
        msgBody.append(consumerPassword);
        msgBody.append("</b><br><br><br>");

        msgBody.append("Ваш пароль восстановлен.<br>");
        msgBody.append("Номер читательского билета: <b>");
        msgBody.append(userName);
        msgBody.append("</b><br>");
        msgBody.append("Ваш новый пароль <b>");
        msgBody.append(consumerPassword);
        msgBody.append("</b><br><br><br>");

        msgBody.append("Ваш пароль восстановлен.<br>");
        msgBody.append("Номер читательского билета: <b>");
        msgBody.append(userName);
        msgBody.append("</b><br>");
        msgBody.append("Ваш новый пароль <b>");
        msgBody.append(consumerPassword);
        msgBody.append("</b><br><br><br>");

        Mail mail = new Mail();
        mail.setMailFrom(mailAccountUserName);
        mail.setMailTo(consumerEmail);
        mail.setMailSubject("Восстановление пароля");
        mail.setContentType("text/html");
        mail.setMailContent(msgBody.toString());

        //
        mailService.sendEmail(mail);
    }

    public void sendRegistrationMessage(String userName,  String consumerEmail, String consumerPassword) {
        StringBuilder msgBody = new StringBuilder();
        msgBody.append("Қайырлы күн! Сіз Қазақстан Республикасының Ұлттық академиялық кітапханасына тіркелдіңіз, Сіздің оқырман билетіңіздің нөмірі ");
        msgBody.append(userName);
        msgBody.append(". Жұмыс істеуге қажетті нұсқаулықпен Сіз мына <a href=\"http://nabrk.kz/wps/portal/Content?contentPath=/ContentKazneb/nab/FutInfo/article/Pomosh\">сілтеме</a> бойынша <a href=\"http://nabrk.kz\">nabrk.kz</a> порталында таныса аласыз. Пластикалық оқырман билеті кітапханаға алғаш келген кезіңізде беріледі.<br>");
        msgBody.append("Порталда қуаттау жасау үшін:<br>");
        msgBody.append("«Логин» жиегінде оқырман билетінің нөмірін теріңіз<br>");
        msgBody.append("«Пароль» жиегінде пароль ");
        msgBody.append(consumerPassword);
        msgBody.append(" теріңіз<br>");
        msgBody.append("Порталдағы «Жеке кабинетте» стандартты парольді өзгертуге болады.<br><br>");

        msgBody.append("Добрый день! Вы зарегистрированы в Национальной академической библиотеке Республики Казахстан, Ваш номер читательского билета ");
        msgBody.append(userName);
        msgBody.append(". С инструкцией по работе на портале <a href=\"http://nabrk.kz\">nabrk.kz</a> Вы можете ознакомиться <a href=\"http://nabrk.kz/wps/portal/Content?contentPath=/ContentKazneb/nab/FutInfo/article/Pomosh\">здесь</a>. Пластиковый читательский билет выдается при первом посещении библиотеки.<br>");
        msgBody.append("Для авторизации на портале:<br>");
        msgBody.append("В поле «логин» наберите номер читательского билета<br>");
        msgBody.append("В поле «пароль» наберите пароль ");
        msgBody.append(consumerPassword);
        msgBody.append("<br>");
        msgBody.append("Изменить стандартный пароль можно в «Личном кабинете» на портале.<br><br>");

        msgBody.append("Good day! You are registered in the National Academic Library of the Republic of Kazakhstan, your library card number is ");
        msgBody.append(userName);
        msgBody.append(". Instructions on using the <a href=\"http://nabrk.kz\">nabrk.kz</a> portal you can find <a href=\"http://nabrk.kz/wps/portal/Content?contentPath=/ContentKazneb/nab/FutInfo/article/Pomosh\">here</a>. Plastic library card is issued when you first visit the library.<br>");
        msgBody.append("For authentication on the portal:<br>");
        msgBody.append("In the \"login\" enter your library card number<br>");
        msgBody.append("In the \"Password\" field, type the password");
        msgBody.append(consumerPassword);
        msgBody.append("<br>");
        msgBody.append("Change the default password may be in the \"My Account\" on the portal.<br><br>");

        Mail mail = new Mail();
        mail.setMailFrom(mailAccountUserName);
        mail.setMailTo(consumerEmail);
        mail.setMailSubject("Дистанциялық оқырманды тіркеу / Регистрация дистанционного читателя / Register remote reader");
        mail.setMailContent(msgBody.toString());
        mailService.sendEmail(mail);
    }

}
