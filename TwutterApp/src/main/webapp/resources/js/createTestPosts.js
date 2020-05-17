let testPosts;
let testPostsDiv = {};

function fetchPosts() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/tweets/search', false);

    xhr.send();

    testPosts = new PostsList(xhr.response.split('\n').map(JSON.parse));

    for (let post of testPosts._posts) {
        testPostsDiv[post.id] = (new PostDiv(post)).getPostDiv();
    }
}

fetchPosts();