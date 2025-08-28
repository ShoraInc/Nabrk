package kz.inessoft.nabrk.elcat.dao.dto;

import java.util.List;

public class SendRequestParam {
    public Integer electronicOrderId;
    public Integer brId;
    public List<ContentInfo> contentInfoList;
    public String userName;
    public String message;
}
