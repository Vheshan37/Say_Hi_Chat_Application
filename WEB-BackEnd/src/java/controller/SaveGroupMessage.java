package controller;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.entity.Group;
import model.entity.GroupMessage;
import model.entity.User;
import org.hibernate.Session;

@WebServlet(name = "SaveGroupMessage", urlPatterns = {"/SaveGroupMessage"})
public class SaveGroupMessage extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        int userID = Integer.valueOf(req.getParameter("user"));
        int groupID = Integer.valueOf(req.getParameter("group"));
        String message = req.getParameter("message");

        User user = (User) session.get(User.class, userID);
        Group group = (Group) session.get(Group.class, groupID);

        GroupMessage groupMessage = new GroupMessage();
        groupMessage.setUser(user);
        groupMessage.setChatGroup(group);
        groupMessage.setMessage(message);
        groupMessage.setDateTime(new Date());

        try {
            session.save(groupMessage);
            session.beginTransaction().commit();

            session.close();
            resp.sendRedirect("GroupMessageList?group=" + groupID);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
