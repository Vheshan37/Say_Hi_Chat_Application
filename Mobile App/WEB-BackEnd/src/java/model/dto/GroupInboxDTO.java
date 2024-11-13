package model.dto;

import java.io.Serializable;
import model.entity.GroupMessage;

public class GroupInboxDTO implements Serializable {

    private GroupMessage groupMessage;
    private String time;

    public GroupInboxDTO() {
    }

    public GroupMessage getGroupMessage() {
        return groupMessage;
    }

    public void setGroupMessage(GroupMessage groupMessage) {
        this.groupMessage = groupMessage;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

}
