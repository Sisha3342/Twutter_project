import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Collectors;

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

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String body = req.getReader().readLine();
        Post postToAdd = (new Gson()).fromJson(body, Post.class);

        resp.getWriter().write(String.valueOf(posts.add(postToAdd)));
    }
}
