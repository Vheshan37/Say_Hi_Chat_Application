package model.dto;

import java.io.Serializable;
import java.util.Date;
import model.entity.ChatStatus;
import model.entity.User;

public class HomeChatDTO implements Serializable {

    private int id;
    private User from;
    private User to;
    private String message;
    private String time;
    private Date dateTime;
    private ChatStatus status;
    private boolean hasImage;
    private String letterName;
    private int unseenCount;
    private boolean hasRelationship;
    private String relativeName;

    public HomeChatDTO() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getFrom() {
        return from;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public User getTo() {
        return to;
    }

    public void setTo(User to) {
        this.to = to;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public ChatStatus getStatus() {
        return status;
    }

    public void setStatus(ChatStatus status) {
        this.status = status;
    }

    public Date getDateTime() {
        return dateTime;
    }

    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
    }

    public boolean isHasImage() {
        return hasImage;
    }

    public void setHasImage(boolean hasImage) {
        this.hasImage = hasImage;
    }

    public String getLetterName() {
        return letterName;
    }

    public void setLetterName(String letterName) {
        this.letterName = letterName;
    }

    public int getUnseenCount() {
        return unseenCount;
    }

    public void setUnseenCount(int unseenCount) {
        this.unseenCount = unseenCount;
    }

    public boolean isHasRelationship() {
        return hasRelationship;
    }

    public void setHasRelationship(boolean hasRelationship) {
        this.hasRelationship = hasRelationship;
    }

    public String getRelativeName() {
        return relativeName;
    }

    public void setRelativeName(String relativeName) {
        this.relativeName = relativeName;
    }

}
