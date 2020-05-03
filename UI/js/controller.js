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

    static addPostHandler() {
        view.displayPage('addPostPage');
    }
}

document.addEventListener('DOMContentLoaded', function() {document.forms.filtersForm.reset();})
document.querySelector('form.filters').addEventListener('submit', Controller.submitFiltersHandler);
document.querySelector('button.more-button').addEventListener('click', Controller.loadMoreTweetsHandler);
document.querySelector('button.add-button').addEventListener('click', Controller.addPostHandler)