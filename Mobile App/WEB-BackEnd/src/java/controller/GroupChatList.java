package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.dto.GroupListDTO;
import model.entity.Group;
import model.entity.GroupMessage;
import model.entity.GroupUser;
import model.entity.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "GroupChatList", urlPatterns = {"/GroupChatList"})
public class GroupChatList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        int userID = Integer.valueOf(req.getParameter("user"));

        User user = (User) session.get(User.class, userID);
        List<Group> list = getGroups(session, user);
        List<GroupListDTO> lastMessageList = new ArrayList<>();
        List<GroupListDTO> noMessageList = new ArrayList<>();

        for (Group groupItem : list) {

            GroupMessage lastMessage = getLastMessage(session, groupItem);
            System.out.println("Last message: " + lastMessage);

            GroupListDTO groupListDTO = new GroupListDTO();
            if (lastMessage != null) {
                SimpleDateFormat format = new SimpleDateFormat("H:mm a");
                String messageTime = format.format(lastMessage.getDateTime());

                groupListDTO.setId(lastMessage.getId());
                groupListDTO.setUser(lastMessage.getUser());
                groupListDTO.setGroup(lastMessage.getChatGroup());
                groupListDTO.setMessage(lastMessage.getMessage());
                groupListDTO.setDateTime(lastMessage.getDateTime());
                groupListDTO.setTime(messageTime);
                groupListDTO.setHasLastMessage(true);

                String applicationPath = req.getServletContext().getRealPath("//group_pictures").replace("\\build\\web", "\\web");
                String filePath = applicationPath + "//group(" + lastMessage.getChatGroup().getId() + ").png";

                File file = new File(filePath);

                if (file.exists()) {
                    groupListDTO.setHasImage(true);
                } else {
                    String[] words = lastMessage.getChatGroup().getName().trim().split("\\s+");
                    if (words.length > 1) {
                        String firstLetter = words[0].substring(0, 1);
                        String secondLetter = words[1].substring(0, 1);
                        groupListDTO.setLetterName((firstLetter + secondLetter).toUpperCase());
                    } else if (words.length > 0) {
                        String firstLetter = words[0].substring(0, 1);
                        groupListDTO.setLetterName(firstLetter.toUpperCase());
                    }
                }

                lastMessageList.add(groupListDTO);
            } else {
                groupListDTO.setGroup(groupItem);

                String applicationPath = req.getServletContext().getRealPath("//group_pictures").replace("\\build\\web", "\\web");
                String filePath = applicationPath + "//group(" + groupItem.getId() + ").png";

                File file = new File(filePath);

                if (file.exists()) {
                    groupListDTO.setHasImage(true);
                } else {
                    String[] words = groupItem.getName().trim().split("\\s+");
                    if (words.length > 1) {
                        String firstLetter = words[0].substring(0, 1);
                        String secondLetter = words[1].substring(0, 1);
                        groupListDTO.setLetterName((firstLetter + secondLetter).toUpperCase());
                    } else if (words.length > 0) {
                        String firstLetter = words[0].substring(0, 1);
                        groupListDTO.setLetterName(firstLetter.toUpperCase());
                    }
                }
                noMessageList.add(groupListDTO);
            }
        }

        lastMessageList.sort((chat1, chat2) -> chat2.getDateTime().compareTo(chat1.getDateTime()));

        List<GroupListDTO> combineList = new ArrayList<>();
        combineList.addAll(noMessageList);
        combineList.addAll(lastMessageList);

        JsonObject jsonObject = new JsonObject();
        jsonObject.add("groupList", gson.toJsonTree(combineList));

        session.beginTransaction().commit();
        session.close();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(combineList));
    }

    public List<Group> getGroups(Session session, User user) {
        Criteria groupList = session.createCriteria(GroupUser.class);
        groupList.add(Restrictions.eq("user", user));
        groupList.setProjection(Projections.distinct(Projections.property("group")));
        return groupList.list();
    }

    public GroupMessage getLastMessage(Session session, Group groupItem) {
        Criteria groupChat = session.createCriteria(GroupMessage.class);
        groupChat.add(Restrictions.eq("chatGroup", groupItem));
        groupChat.addOrder(Order.desc("dateTime"));
        groupChat.setMaxResults(1);
        return (GroupMessage) groupChat.uniqueResult();
    }
}
