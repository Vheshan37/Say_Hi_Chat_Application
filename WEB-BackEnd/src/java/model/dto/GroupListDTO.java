package model.dto;

import java.io.Serializable;
import java.util.Date;
import model.entity.Group;
import model.entity.User;

public class GroupListDTO implements Serializable {

    private int id;
    private User user;
    private Group group;
    private String message;
    private Date dateTime;
    private String time;
    private boolean hasImage;
    private String letterName;
    private boolean hasLastMessage;

    public GroupListDTO() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean isHasLastMessage() {
        return hasLastMessage;
    }

    public void setHasLastMessage(boolean hasLastMessage) {
        this.hasLastMessage = hasLastMessage;
    }
}
