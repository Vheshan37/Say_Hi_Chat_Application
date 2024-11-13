package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.entity.Chat;
import model.entity.ChatStatus;
import model.entity.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SaveMessage", urlPatterns = {"/SaveMessage"})
public class SaveMessage extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        int userID = Integer.valueOf(req.getParameter("user"));
        int senderID = Integer.valueOf(req.getParameter("sender"));
        String message = req.getParameter("message");

        User from = (User) session.get(User.class, userID);
        User to = (User) session.get(User.class, senderID);

        Criteria chatStatusTable = session.createCriteria(ChatStatus.class);
        chatStatusTable.add(Restrictions.eq("status", "Sent"));
        ChatStatus status = (ChatStatus) chatStatusTable.uniqueResult();

        Chat chat = new Chat();
        chat.setFrom(from);
        chat.setTo(to);
        chat.setMessage(message);
        chat.setDateTime(new Date());
        chat.setStatus(status);

        try {
            session.save(chat);
            session.beginTransaction().commit();

            session.close();
            resp.sendRedirect("InboxChatList?user=" + userID + "&sender=" + senderID);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
