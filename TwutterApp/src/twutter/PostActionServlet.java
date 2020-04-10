import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class PostActionServlet extends HttpServlet {
    private static PostsList posts = new PostsList();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String parameterName = "id";
        String postId = req.getParameter(parameterName);

        Post postToReturn = posts.getPost(postId);

        resp.getWriter().print((new Gson()).toJson(postToReturn));
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String parameterName = "id";
        String postId = req.getParameter(parameterName);

        resp.getWriter().print(String.valueOf(posts.remove(postId)));
    }
}
