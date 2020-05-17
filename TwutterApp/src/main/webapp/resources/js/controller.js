class Controller {
    static submitFiltersHandler(event) {
        event.preventDefault();

        let filtersInputs = document.forms.filtersForm.elements;
        let filterObject = {};

        for (let input of filtersInputs) {
           switch (input.name) {
               case 'nameInput':
                   if (input.value !== '') {
                       filterObject['author'] = input.value;
                   }
                   break;
                case 'startDateInput':
                    if (input.value !== '') {
                        filterObject["startDate"] = Date.parse(input.value);
                    }
                    break;
                case 'endDateInput':
                    if (input.value !== '') {
                        filterObject['endDate'] = Date.parse(input.value);
                    }
                    break;
                case 'hashTagsInput':
                    if (input.value !== '') {
                        filterObject['hashTags'] = input.value.split(' ');
                    }
                    break;
                default:
                    break;
            }
        }
        
        view.setPostsList(testPosts.getPage(undefined, testPosts.getLength(), filterObject));
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

        // let addedPost = document.forms.postForm.elements;
        // let post = {};
        //
        // post.id = (parseInt(testPosts.findMaxId()) + 1).toString();
        // post.author = view._currentUser;
        // post.createdAt = new Date();
        // post.likes = [];
        // post.hashTags = addedPost.postHashtagsInput.value.split(',');
        // post.description = addedPost.postDescriptionInput.value;

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

        postFormElements.postHashtagsInput.value = postInstance.hashTags.join(',');
        postFormElements.postDescriptionInput.value = postInstance.description;
        postFormElements.postHashtagsInput.value = postInstance.hashTags.join(',');

        function editPostHandler(event) {
            event.preventDefault();

            let editedPost = {};

            editedPost.hashTags = postFormElements.postHashtagsInput.value.split(',');
            editedPost.description = postFormElements.postDescriptionInput.value;

            if (postFormElements.postImageInput.value !== '') {
                editedPost.photoLink = post.postImageInput.value;
            }

            testPosts.edit(postId, editedPost);

            view.displayPage('mainPage');
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