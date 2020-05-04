testPosts = new PostsList([...generatePosts(40)]);
// testPosts = PostsList.restoreFromLocalStorage();

testPostsDiv = testPosts._posts.map(function(post) {
    return (new PostDiv(post)).getPostDiv();
});