class Controller {
    static submitFilters(event) {
        event.preventDefault();

        let filtersInputs = document.forms.filtersForm.elements; 
        let filterObject = {};

        for (let input of filtersInputs) {
           switch (input.name) {
               case "nameInput":
                   if (input.value !== "") {
                       filterObject["author"] = input.value;
                   }
                   break;
                case "startDateInput":
                    if (input.value !== "") {
                        filterObject["startDate"] = Date.parse(input.value);
                    }
                    break;
                case "endDateInput":
                    if (input.value !== "") {
                        filterObject["endDate"] = Date.parse(input.value);
                    }
                    break;
                case "hashTagsInput":
                    if (input.value !== "") {
                        filterObject["hashTags"] = input.value.split(" ");
                    }
                    break;
                default:
                    break;
            }
        }
        // filterConfig
        // console.log(testPosts.getPage(undefined, undefined, filterObject));
        view._postsList = testPosts.getPage(undefined, undefined, filterObject);
        view.refreshPage();
    }
}

document.addEventListener("DOMContentLoaded", function() {document.forms.filtersForm.reset();})
document.querySelector("form.filters").addEventListener("submit", Controller.submitFilters);

