package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.dto.GroupChatDTO;
import model.dto.GroupInboxDTO;
import model.dto.InboxChatDTO;
import model.entity.Chat;
import model.entity.ChatStatus;
import model.entity.Group;
import model.entity.GroupMessage;
import model.entity.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "GroupMessageList", urlPatterns = {"/GroupMessageList"})
public class GroupMessageList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        int groupID = Integer.valueOf(req.getParameter("group"));
        List<GroupInboxDTO> responseList = new ArrayList<>();

        JsonObject jsonObject = new JsonObject();
        Group group = (Group) session.get(Group.class, groupID);

        Criteria messageTable = session.createCriteria(GroupMessage.class);
        messageTable.add(Restrictions.eq("chatGroup", group));
        messageTable.addOrder(Order.asc("dateTime"));
        List<GroupMessage> messageList = messageTable.list();
        for (GroupMessage groupMessage : messageList) {

            SimpleDateFormat format = new SimpleDateFormat("H:mm a");
            String messageTime = format.format(groupMessage.getDateTime());

            GroupInboxDTO responseDTO = new GroupInboxDTO();
            responseDTO.setGroupMessage(groupMessage);
            responseDTO.setTime(messageTime);
            responseList.add(responseDTO);
        }

        jsonObject.add("messageList", gson.toJsonTree(responseList));

        session.beginTransaction().commit();
        session.close();

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }

}
