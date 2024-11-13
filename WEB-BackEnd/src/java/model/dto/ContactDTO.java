package model.dto;

import java.io.Serializable;
import model.entity.User;

public class ContactDTO implements Serializable {

    private User user;
    private boolean hasRelationShip;
    private String relativeName;
    private boolean hasImage;
    private String letterName;

    public ContactDTO() {
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isHasRelationShip() {
        return hasRelationShip;
    }

    public void setHasRelationShip(boolean hasRelationShip) {
        this.hasRelationShip = hasRelationShip;
    }

    public String getRelativeName() {
        return relativeName;
    }

    public void setRelativeName(String relativeName) {
        this.relativeName = relativeName;
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
}
