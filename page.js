var apiUrl = "https://www.omdbapi.com/?apikey=3c056857";
var moviesList = [];
var numOfPages = 1;
var pageNum = 1;
var searchKeyword=""
const loader = `<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`;

const movieListPageTopHTML = `
<div id="movieList">
<div id="movieListTitle">Movies List</div>
<div id="searchbar">
       <input id="searchbarInput" value="${searchKeyword}" type="text" placeholder="Search by name..." /><img id="searchKeyword" src="./search.png" alt="search" />
</div>
<div id="movieListItemsContainer">
`;

const movieListPageBottomHTML = `
</div>
            <div id="paginationContainer">
            <ul id="pagination">
          </ul> 
            </div>
        </div>
`;

const fetchMovies = async (keyword, pageNumber) => {
    await fetch(`${apiUrl}&s=${keyword}&page=${pageNumber}`).then((res) => {
        let obj = res.json();
        return obj;
    }).then((res) => {
        if(res.Response === "True"){
            localStorage.setItem("errorStatus", JSON.stringify(false))
            let pages = parseInt(res.totalResults/10)+1;
            let movies = res.Search;
            moviesList = movies;
            numOfPages = pages;
            localStorage.setItem("moviesList", JSON.stringify(movies));
            localStorage.setItem("numOfPages", JSON.stringify(pages));
        }else{
            localStorage.setItem("errorStatus", JSON.stringify(false))
            localStorage.setItem("errorMsg", JSON.stringify(res.Error))
        }
        
    });
}

const handleEditInSearchBar = (event) => {
    searchKeyword = event.target.value;
    localStorage.setItem("searchKeyword", searchKeyword);
}

const updatePageNumber = async (event) => {
    pageNum = parseInt(event.target.innerText);
    localStorage.setItem("pageNum", JSON.stringify(pageNum));
    let keyword = localStorage.getItem("searchKeyword");
    updatePagination();
    document.getElementById("movieListItemsContainer").innerHTML = loader
    await fetchMovies(keyword, pageNum);
    updateMoviesListHTML();
}

const handleEnterInSeachbar = async (event) => {

    if (event.keyCode === 13) {
        handleEditInSearchBar(event);
    }
  };

const addFunctionalities = () => {
    const handleEditInSearchBarInput = document.getElementById("searchbarInput");
    handleEditInSearchBarInput.addEventListener("input", handleEditInSearchBar);
    handleEditInSearchBarInput.addEventListener("keydown", handleEnterInSeachbar);


    const searchButton = document.getElementById("searchKeyword");
    searchButton.addEventListener("click", searchMovies);

    const changePage = document.getElementsByClassName("paginationPageNum");
    for(let elem of changePage){
        elem.addEventListener("click", updatePageNumber);
    }
}

const updatePagination = () => {
    let pageNumber = JSON.parse(localStorage.getItem("pageNum"));
    let numberOfPages = JSON.parse(localStorage.getItem("numOfPages"));

    let paginationHTML = `<li><a id="previousPage">«</a></li>`;
    let start = 0;
    let totalShow = numberOfPages;
    if(numberOfPages > 7){
        start = pageNumber-1;
        totalShow = 7 + start;
    }

    for(let i=start;i<totalShow;i++){
        if(i===pageNumber-1){
            paginationHTML += `<li><a class="active paginationPageNum">${i+1}</a></li>`;
        }else{
            paginationHTML += `<li><a class="paginationPageNum">${i+1}</a></li>`;
        }
    }
    paginationHTML += `<li><a id="nextPage">»</a></li>`

    document.getElementById("pagination").innerHTML = paginationHTML;
}

const updateMoviesListHTML = () => {
    let movieListItems = "";
    let moviesList = JSON.parse(localStorage.getItem("moviesList"));
    moviesList.forEach((movie, index) => {
        let truncateTitle;
        let wholeTitle = movie.Title;
        if (wholeTitle.length > 20) {
            truncateTitle = wholeTitle.substring(0, 17) + "...";
          } else {
            truncateTitle = wholeTitle;
          }
        let poster = movie.Poster;
        movieListItems += `
        <div class="movieListItem" id="${index}">
                    <img alt="poster" src="${poster}" class="movieListPoster" />
                    <div class="movieListTitle">${truncateTitle}</div>
        </div>
        `
    });

    document.getElementById("mainContainer").innerHTML = movieListPageTopHTML + movieListItems + movieListPageBottomHTML;
    updatePagination();
    addFunctionalities();
}

const searchMovies = async (event) => {
    document.getElementById("mainContainer").innerHTML = loader;
    let keyword = localStorage.getItem("searchKeyword");
    await fetchMovies(keyword, 1);
    updateMoviesListHTML();
}

const intitialize = async () => {
    document.getElementById("mainContainer").innerHTML = loader;
    if (!localStorage.getItem("moviesList")){
        localStorage.setItem("moviesList", JSON.stringify(moviesList));
    }
    if(!localStorage.getItem("numOfPages")){
        localStorage.setItem("numOfPages", JSON.stringify(numOfPages));
    }
    if(!localStorage.getItem("searchKeyword")){
        localStorage.setItem("searchKeyword", JSON.stringify(searchKeyword));
    }else{
        searchKeyword = localStorage.getItem("searchKeyword");
    }
    
    localStorage.setItem("pageNum", JSON.stringify(1));
    // await fetchMovies("marvel", 1);
    updateMoviesListHTML();

}

document.addEventListener("DOMContentLoaded", function () {
    intitialize();
});