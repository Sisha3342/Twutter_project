import java.util.*;

public class PostsList {
    private List<Post> posts;

    public PostsList() {
        posts = new ArrayList<>();

        this.add(new Post("1", "abc", new Date(), "Sisha", "link",
                List.of("tag1", "tag2"), List.of("Alex", "Misha")));
        this.add(new Post("2", "abc", new Date(), "Alex", "link123",
                List.of("tag1", "tag3"), List.of("Alex")));
    }

    public Post getPost(String id) {
        for (Post post: posts) {
            if (post.getId().equals(id)) {
                return post;
            }
        }

        return null;
    }

    public static boolean validate(Post post) {
        return  post.getId() != null && post.getId().length() > 0 &&
                post.getDescription() != null && post.getDescription().length() < 200 &&
                post.getCreatedAt() != null &&
                post.getAuthor() != null && post.getAuthor().length() > 0;
    }

    public boolean add(Post post) {
        if (validate(post)) {
            posts.add(post);

            return true;
        }

        return false;
    }

    public boolean remove(String id) {
        return posts.removeIf(post -> post.getId().equals(id));
    }

    public List<Post> addAll(List<Post> newPosts) {
        List<Post> invalidPosts = new ArrayList<>();

        for (Post post: newPosts) {
            if (validate(post)) {
                posts.add(post);
            }
            else {
                invalidPosts.add(post);
            }
        }

        return invalidPosts;
    }

    public void clear() {
        posts.clear();
    }

    public List<Post> getPosts() {
        return posts;
    }
}
