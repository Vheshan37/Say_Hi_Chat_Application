package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
import model.dto.InboxChatDTO;
import model.entity.Chat;
import model.entity.ChatStatus;
import model.entity.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "InboxChatList", urlPatterns = {"/InboxChatList"})
public class InboxChatList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        int userID = Integer.valueOf(req.getParameter("user"));
        int senderID = Integer.valueOf(req.getParameter("sender"));
        List<InboxChatDTO> responseList = new ArrayList<>();

        JsonObject jsonObject = new JsonObject();
        User user = (User) session.get(User.class, userID);
        User sender = (User) session.get(User.class, senderID);

        Criteria chatTable = session.createCriteria(Chat.class);
        chatTable.add(Restrictions.or(
                Restrictions.and(Restrictions.eq("from", sender), Restrictions.eq("to", user)),
                Restrictions.and(Restrictions.eq("from", user), Restrictions.eq("to", sender))
        ));
        chatTable.addOrder(Order.asc("dateTime"));
        List<Chat> chatList = chatTable.list();
        for (Chat chat : chatList) {
            SimpleDateFormat format = new SimpleDateFormat("H:mm a");
            String messageTime = format.format(chat.getDateTime());

            InboxChatDTO responseDTO = new InboxChatDTO();
            responseDTO.setId(chat.getId());
            responseDTO.setFrom(chat.getFrom());
            responseDTO.setTo(chat.getTo());
            responseDTO.setMessage(chat.getMessage());
            responseDTO.setDateTime(chat.getDateTime());
            responseDTO.setTime(messageTime);
            responseDTO.setStatus(chat.getStatus());
            responseList.add(responseDTO);
        }

        Criteria chatStatus = session.createCriteria(ChatStatus.class);
        chatStatus.add(Restrictions.eq("status", "Seen"));
        ChatStatus status = (ChatStatus) chatStatus.uniqueResult();

        Criteria unseenChat = session.createCriteria(Chat.class);
        unseenChat.add(Restrictions.and(Restrictions.eq("from", sender), Restrictions.eq("to", user)));
        unseenChat.add(Restrictions.ne("status", status));
        List<Chat> unseenChatList = unseenChat.list();

        for (Chat unseenChatItem : unseenChatList) {
            Criteria deliveredStatus = session.createCriteria(ChatStatus.class);
            deliveredStatus.add(Restrictions.eq("status", "Seen"));
            ChatStatus seen = (ChatStatus) deliveredStatus.uniqueResult();
            unseenChatItem.setStatus(seen);
            session.save(unseenChatItem);
        }

        jsonObject.add("chatList", gson.toJsonTree(responseList));

        session.beginTransaction().commit();

        session.close();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }
}
