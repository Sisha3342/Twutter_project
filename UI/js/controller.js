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

        let addedPost = document.forms.postForm.elements; 
        let post = {};

        post.id = testPosts.getLength().toString();
        post.author = view._currentUser;
        post.createdAt = new Date();
        post.likes = [];
        post.hashTags = addedPost.postHashtagsInput.value.split(',');
        post.description = addedPost.postDescriptionInput.value;

        if (addedPost.postImageInput.value !== '') {
            post.photoLink = addedPost.postImageInput.value;
        }

        testPosts.add(post);
        testPostsDiv.push((new PostDiv(post)).getPostDiv());

        view.displayPage('mainPage');
    }

    static PostActionHandler(event) {
        let target = event.target;
        
        switch (target.className) {
            case 'action-button':
                let post = target.closest('.test-post');

                if (target.textContent === 'Delete') {
                    Controller.deletePostHandler(post);
                }
                else {
                    Controller.processEditPostPage(post);
                }
                break;
            case 'post-like':
                break;
            default:
                break;
        }
    }

    static deletePostHandler(post) {
        if (confirm('Delete this post?')) {
            let postIndex = getPostIndex(post);

            testPosts.remove(postIndex.toString());
            testPostsDiv.splice(postIndex, 1);
            
            View._setPostsDisplay(view);
            view.refreshPage();
        }
    }

    static processEditPostPage(post) {
        view.displayPage('editPostPage');
        let postFormElements = document.forms.postForm.elements; 
        let postInstance = testPosts.get(getPostIndex(post).toString());

        console.log(postInstance);

        postFormElements.postHashtagsInput.value = postInstance.hashTags.join(',');
        postFormElements.postDescriptionInput.value = postInstance.description;
        postFormElements.postHashtagsInput.value = postInstance.hashTags.join(',');

        if (postInstance.hasOwnProperty('photoLink')) {
            postFormElements.postImageInput.value = postInstance.photoLink;
        }


        function editPostHandler(event) {
            event.preventDefault();

            let editedPost = {};

            editedPost.hashTags = postFormElements.postHashtagsInput.value.split(',');
            editedPost.description = postFormElements.postDescriptionInput.value;

            if (postFormElements.postImageInput.value !== '') {
                editedPost.photoLink = post.postImageInput.value;
            }

            testPosts.edit(getPostIndex(post).toString(), editedPost);
            testPostsDiv[getPostIndex(post)] = ((new PostDiv(testPosts.get(getPostIndex(post).toString()))).getPostDiv());

            view.displayPage('mainPage');
        }

        document.querySelector('button.back-button').addEventListener('click', Controller.backHandler);
        document.querySelector('button.edit-post-button').addEventListener('click', editPostHandler);
    }

    static setMainHandlers() {
        document.addEventListener('DOMContentLoaded', function() {document.forms.filtersForm.reset();})
        document.querySelector('form.filters').addEventListener('submit', Controller.submitFiltersHandler);
        document.querySelector('button.more-button').addEventListener('click', Controller.loadMoreTweetsHandler);
        document.querySelector('button.add-button').addEventListener('click', Controller.addHandler);
        document.querySelector('.posts').addEventListener('click', Controller.PostActionHandler);
    }

    static setAddPostHandlers() {
        document.querySelector('button.back-button').addEventListener('click', Controller.backHandler);
        document.querySelector('button.add-post-button').addEventListener('click', Controller.addPostHandler);
    }
}