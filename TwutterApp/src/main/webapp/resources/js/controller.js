class Controller {
    static submitFiltersHandler(event) {
        event.preventDefault();

        let filtersForm = new FormData(document.forms.filtersForm);

        testPosts.getPage(0, testPosts.getLength(), filtersForm).then(function (response) {
            let filtered;


            if (response === "") {
                filtered = new PostsList([]);
            }
            else {
                filtered = new PostsList(response.split('\n').map(JSON.parse));
            }
            
            view.setPostsList(filtered);
        })
    }

    static loadMoreTweetsHandler() {
        if (testPosts.getLength() - view._postsToShowCount >= 10) {
            view.setPostsToShowCount(view._postsToShowCount + 10);
        }
        else {
            view.setPostsToShowCount(testPosts.getLength());
        }
    }

    static addHandler() {
        view.displayPage('addPostPage');
    }

    static backHandler() {
        view.displayPage('mainPage');
    }

    static addPostHandler(event) {
        event.preventDefault();

        let formData = new FormData(document.forms.postForm);
        formData.append('id', (parseInt(testPosts.findMaxId()) + 1).toString());
        formData.append('author', view._currentUser);
        formData.append('createdAt', (new Date()).toISOString().
        replace(/T/, ' ').replace(/\..+/, ''));
        formData.append('likes', [].toString());

        testPosts.add(formData).then(function () {
            fetchPosts();

            view.displayPage('mainPage');
        });
    }

    static postActionHandler(event) {
        if (view._currentUser === '') {
            return ;
        }

        let target = event.target;
        let post = target.closest('.test-post');

        switch (target.className) {
            case 'action-button':
                if (target.textContent === 'Delete') {
                    Controller.deletePostHandler(post);
                }
                else {
                    Controller.processEditPostPage(post);
                }
                break;
            case 'post-like':
                Controller.likePostHandler(post);
                break;
            default:
                break;
        }
    }

    static deletePostHandler(post) {
        if (confirm('Delete this post?')) {
            let postId = getPostId(post);

            testPosts.remove(postId).then(function () {

                fetchPosts();

                View.setPostsDisplay(view);
                view.refreshPage();
                document.forms.filtersForm.reset();
            });
        }
    }

    static likePostHandler(post) {
        let postId = getPostId(post);

        let postInstance = testPosts.get(postId);
        let userIndex = postInstance.likes.indexOf(view._currentUser);

        if (userIndex !== -1) {
            postInstance.likes.splice(userIndex, 1);

            testPosts.edit(postId, {likes: postInstance.likes}).then(function () {
                let likesCount = post.querySelector('.likes-count');
                likesCount.textContent = +likesCount.textContent - 1 + '';

                fetchPosts();
            });
        }
        else {
            postInstance.likes.push(view._currentUser);

            testPosts.edit(postId, {likes: postInstance.likes}).then(function () {
                let likesCount = post.querySelector('.likes-count');
                likesCount.textContent = +likesCount.textContent + 1 + '';

                fetchPosts();
            });
        }
    }

    static processEditPostPage(post) {
        view.displayPage('editPostPage');

        let postFormElements = document.forms.postForm.elements; 
        let postId = getPostId(post);
        let postInstance = testPosts.get(postId);

        postFormElements.hashTags.value = postInstance.hashTags.join(',');
        postFormElements.description.value = postInstance.description;

        function editPostHandler(event) {
            event.preventDefault();

            let editedPost = {};

            editedPost.hashTags = postFormElements.hashTags.value.split(',');
            editedPost.description = postFormElements.description.value;

            if (postFormElements.photoLink.value !== '') {
                editedPost.photoLink = post.photoLink.value;
            }

            testPosts.edit(postId, editedPost).then(function () {
                fetchPosts();

                view.displayPage('mainPage');
            });
        }

        document.querySelector('button.back-button').addEventListener('click', Controller.backHandler);
        document.querySelector('button.edit-post-button').addEventListener('click', editPostHandler);
    }

    static logHandler() {
        view.displayPage('authPage');
    }

    static logInHandler(event) {
        event.preventDefault();

        let userForm = document.forms.userForm.elements;
        let userName = userForm.userNameInput.value;
        let userPass = userForm.userPasswordInput.value;
        
        for (let user in registeredUsers) {
            if (user === userName && registeredUsers[user] === userPass) {
                view._currentUser = userName;
                view.displayPage('mainPage');

                return ;
            }
        }

        alert('Incorrect username/password');
    }

    static setMainHandlers() {
        document.addEventListener('DOMContentLoaded', function() {document.forms.filtersForm.reset();})
        document.querySelector('form.filters').addEventListener('submit', Controller.submitFiltersHandler);
        document.querySelector('button.more-button').addEventListener('click', Controller.loadMoreTweetsHandler);
        document.querySelector('button.add-button').addEventListener('click', Controller.addHandler);
        document.querySelector('.posts').addEventListener('click', Controller.postActionHandler);
        document.querySelector('button.log-in-out').addEventListener('click', Controller.logHandler);
    }

    static setAddPostHandlers() {
        document.querySelector('button.back-button').addEventListener('click', Controller.backHandler);
        document.querySelector('button.add-post-button').addEventListener('click', Controller.addPostHandler);
    }

    static setLogHandlers() {
        document.querySelector('button.back-button').addEventListener('click', Controller.backHandler);
        document.querySelector('button.log-in-button').addEventListener('click', Controller.logInHandler);
    }
}