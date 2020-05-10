function* generatePosts(postsCount) {
    let date = new Date;

    for (let i = 0; i < postsCount; i++) {
        if (i % 2 === 0) {
            yield {
                id: i.toString(),
                description: 'post number ' + i,
                createdAt: new Date(date.getTime() + i * 100000000),
                author: 'Sasha',
                hashTags: ['js' + i, 'task6'],
                likes: ['Misha', 'Alex', 'Mike']
            };
        }
        else {
            yield {
                id: i.toString(),
                description: 'post number ' + i,
                createdAt: new Date(date.getTime() - i * 100000000),
                author: 'Alex',
                photoLink: 'images/forest_image.png',
                hashTags: ['js', 'task6'],
                likes: ['Sasha']
            };
        }
    }
}

let testPosts;

if (!localStorage.posts) {
    testPosts = new PostsList([...generatePosts(15)]);   
}
else {
    testPosts = PostsList.restoreFromLocalStorage();
}

let testPostsDiv = {};
for (let post of testPosts._posts) {
    testPostsDiv[post.id] = (new PostDiv(post)).getPostDiv();
}