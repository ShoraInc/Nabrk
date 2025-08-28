package kz.nabrk.nabrkoauth2server.service.mail;

import kz.nabrk.nabrkoauth2server.pojo.mail.Mail;

public interface MailService {
    public void sendEmail(Mail mail);
}
