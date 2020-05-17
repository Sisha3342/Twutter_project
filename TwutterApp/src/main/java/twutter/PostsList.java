package twutter;

import java.util.*;

public class PostsList {
    private List<Post> posts;

    public PostsList(int postsCount) {
        posts = new ArrayList<>();

        for (int i = 0; i < postsCount; i++) {
            if (i % 2 == 0) {
                this.add(new Post.Builder(String.valueOf(i), "post number" + i, new Date(), "Sasha")
                        .setHashTags(List.of("js" + i, "task12"))
                        .setLikes(List.of("Alex", "Misha", "Mike"))
                        .build());
            }
            else {
                this.add(new Post.Builder(String.valueOf(i),
                        "post number" + i,
                        new Date(i * 100000000),
                        "Alex")
                        .setPhotoLink("images/forest_image.png")
                        .setHashTags(List.of("js", "task12"))
                        .setLikes(List.of("Sasha"))
                        .build());
            }
        }
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

    public boolean edit(String id, Post post) {
        Post foundPost = this.getPost(id);

        if (post == null || post.getId() != null ||post.getAuthor() != null ||
                post.getCreatedAt() != null) {
            return false;
        }

        if (post.getDescription() != null) {
            foundPost.setDescription(post.getDescription());
        }

        if (post.getPhotoLink() != null) {
            post.setPhotoLink(post.getPhotoLink());
        }

        if (post.getHashTags() != null) {
            foundPost.setHashTags(post.getHashTags());
        }

        if (post.getLikes() != null) {
            foundPost.setLikes(post.getLikes());
        }

        return true;
    }

    public List<Post> getPosts() {
        return posts;
    }
}
