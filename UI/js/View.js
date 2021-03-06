function getPostId(post) {
    for (let [id, currentPost] of Object.entries(testPostsDiv)) {
        if (post.querySelector('h3').textContent === currentPost.querySelector('h3').textContent &&
            post.querySelector('h4').textContent === currentPost.querySelector('h4').textContent &&
            post.querySelector('.post-description').textContent === currentPost.querySelector('.post-description').textContent) {
                return id;
        }               
    }

    return "-1";
}

registeredUsers = {Sasha: '3342',
                  Alex: '123123'};


class View {
    constructor() {
        this._currentUser = '';
        View.setPostsDisplay(this);

        this.displayPage('mainPage');
    }

    static setPostsDisplay(pageView) {
        pageView._postsToShowCount = 10;
        pageView._postsList = testPosts;
        pageView._posts = document.querySelector('.posts');
    }

    setPostsToShowCount(count) {
        this._postsToShowCount = count;
        this.refreshPage();
    }

    setPostsList(postsList) {
        this._postsToShowCount = 10;
        this._postsList = postsList;
        this.refreshPage();
    }

    refreshPage() {
        testPosts.saveToLocalStorage();

        for (let post of testPosts._posts) {
            testPostsDiv[post.id] = (new PostDiv(post)).getPostDiv();
        }

        this._authorizedUserDisplay();
        this._authorizedAddDisplay();
        this._posts.innerHTML = '';

        this._postsList.getPage(undefined, this._postsToShowCount)._posts.forEach(post => {
            this._posts.append((new PostDiv(post)).getPostDiv());
        });

        this._authorizedPostDisplay();
    }

    _authorizedUserDisplay() {
        document.querySelector('.log-in-out').style.visibility = 'visible';

        if (this._currentUser === '') {
            document.querySelector('.log-in-out').textContent = 'Log in';
            document.querySelector('.user-info').style.visibility = 'hidden';
            document.querySelector('.user-info').textContent = '';
        }
        else {
            document.querySelector('.log-in-out').textContent = 'Log out';
            document.querySelector('.user-info').style.visibility = 'visible';
            document.querySelector('.user-info').textContent = 'Current User: ' + this._currentUser;
        }
    }

    _authorizedPostDisplay() {
        if (this._currentUser !== '') {
            let posts = document.querySelectorAll('.test-post');
            posts.forEach(post => {
                if (this._currentUser === post.querySelector('h3').textContent) {
                    post.querySelector('.post-actions-buttons').style.visibility = 'visible';
                }   
            });
        }
     }

    _authorizedAddDisplay() {
        if (this._currentUser === '') {
            document.querySelector('.add-button').style.visibility = 'hidden';
        }
    }

    displayPage(page) {
        let pageHandlers = {
            addPostPage: View._showAddPostPage,
            editPostPage: View._showEditPostPage,
            mainPage: View._showMainPage,
            authPage: View._showAuthPage
        };

        for (let handler in pageHandlers) {
            if (handler === page) {
                pageHandlers[handler](this, 'visible');
            }
            else {
                pageHandlers[handler](this, 'hidden');
            }
        }
    }

    static _showMainPage(pageView, visibility) {
        if (visibility === 'hidden') {
            let content = document.querySelector('.content')

            if (content) {
                content.remove();
            }

            return ;
        }

        let content = document.createElement('div');
        content.className = 'content';
        
        content.innerHTML = `
        <form name="filtersForm" class="filters">
            <h1>Filters</h1>

            <div class="filter">
                <p>Name</p>
                <input name="nameInput" type="text" placeholder="Name">
            </div>

            <div class="filter">
                <p>Date</p>
                
                <input name="startDateInput" type="date">
                <input name="endDateInput" type="date">

            </div>

            <div class="filter">
                <p>Hashtags</p>
                <input name="hashTagsInput" type="text" placeholder="Tags">
            </div>

            <input type="submit" class="apply-filters" value="apply">
        </form>

        <div class="news-seed">
            <button class="add-button">Add post</button>

            <div class="posts">
            </div>
            
            <button class="more-button">Load more</button>
        </div>
        `;

        document.querySelector('header').after(content);
        
        View.setPostsDisplay(pageView);
        pageView.refreshPage();

        Controller.setMainHandlers();
    }

    
    static _showAddPostPage(pageView, visibility) {
        if (visibility === 'hidden') {
            let addPost = document.querySelector('.add-post')

            if (addPost) {
                addPost.remove();
            }

            return ;
        }

        let addForm = document.createElement('div');
        addForm.className = 'add-post';

        addForm.innerHTML = `
            <form name="postForm">
                <h2>HashTags (separated by ',')</h2>
                <input name="postHashtagsInput" type="text" placeholder="tags">
                
                <h2>Description</h2>
                <textarea name="postDescriptionInput" rows="10"></textarea>
                
                <h2>Image</h2>
                <input name="postImageInput" type="file" accept=".jpg, .jpeg, .png">
            </form>
            
            <button class="add-post-button">Add post</button>
            <button class="back-button">Cancel</button>
        `;

        document.querySelector('header').after(addForm);
        Controller.setAddPostHandlers();
    }

    
    static _showEditPostPage(pageView, visibility) {
        if (visibility === 'hidden') {
            let editPost = document.querySelector('.edit-post')

            if (editPost) {
                editPost.remove();
            }

            return ;
        }

        let editForm = document.createElement('div');
        editForm.className = 'edit-post';

        editForm.innerHTML = `
        <form name="postForm">
            <h2>HashTags (separated by ',')</h2>
            <input name="postHashtagsInput" type="text" placeholder="tags">
            
            <h2>Description</h2>
            <textarea name="postDescriptionInput" rows="10"></textarea>
            
            <h2>Image</h2>
            <input name="postImageInput" type="file" accept=".jpg, .jpeg, .png">
        </form>

        <button class="edit-post-button">Save</button>
        <button class="back-button">Cancel</button>
        `;

        document.querySelector('header').after(editForm);
    }

    
    static _showAuthPage(pageView, visibility) {
        if (visibility === 'hidden') {
            let userForm = document.querySelector('.user-form')

            if (userForm) {
                userForm.remove();
            }

            return ;
        }

        document.querySelector('button.log-in-out').style.visibility = 'hidden';
        document.querySelector('.user-info').style.visibility = 'hidden';
        view._currentUser = '';

        let userForm = document.createElement('div');
        userForm.className = 'user-form';

        userForm.innerHTML = `
        <form name="userForm">
            <h2>Username</h2>
            <input name="userNameInput" type="text" placeholder="user">
            
            <h2>Password</h2>
            <input name="userPasswordInput" type="password">
        </form>

        <button class="log-in-button">Log in</button>
        <button class="back-button">Cancel</button>
        `;

        document.querySelector('header').after(userForm);
        Controller.setLogHandlers();
    }
}

let view = new View();