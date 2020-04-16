package twutter;

import java.util.*;

public class PostsList {
    private List<Post> posts;

    public PostsList() {
        posts = new ArrayList<>();

        this.add(new Post.Builder("1", "abc", new Date(), "Sasha")
                .setPhotoLink("link")
                .setHashTags(List.of("tag1", "tag2"))
                .setLikes(List.of("Alex", "Misha"))
                .build());

        this.add(new Post.Builder("2", "abc", new Date(), "Alex")
                .setPhotoLink("link123")
                .setHashTags(List.of("tag1", "tag3"))
                .setLikes(List.of("Alex"))
                .build());
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

    public void clear() {
        posts.clear();
    }

    public List<Post> getPosts() {
        return posts;
    }
}
