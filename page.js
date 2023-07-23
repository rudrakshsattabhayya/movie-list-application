var apiUrl = "https://www.omdbapi.com/?apikey=3c056857";
var moviesList = [];
var numOfPages = 1;
var pageNum = 1;
var movieDetails = {};
var searchKeyword="";
var commentText = "";
var starRating = 0;
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

const starInput = `
<div class="rating">
<label>
  <input type="radio" name="stars" value="1" />
  <span class="icon">★</span>
</label>
<label>
  <input type="radio" name="stars" value="2" />
  <span class="icon">★</span>
  <span class="icon">★</span>
</label>
<label>
  <input type="radio" name="stars" value="3" />
  <span class="icon">★</span>
  <span class="icon">★</span>
  <span class="icon">★</span>   
</label>
<label>
  <input type="radio" name="stars" value="4" />
  <span class="icon">★</span>
  <span class="icon">★</span>
  <span class="icon">★</span>
  <span class="icon">★</span>
</label>
<label>
  <input type="radio" name="stars" value="5" />
  <span class="icon">★</span>
  <span class="icon">★</span>
  <span class="icon">★</span>
  <span class="icon">★</span>
  <span class="icon">★</span>
</label>
</div>
`

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

const fetchMovieDetails = async (id) => {
    await fetch(`${apiUrl}&i=${id}`).then((res) => {
        let obj = res.json();
        return obj;
    }).then((res) => {
        if(res.Response === "True"){
            localStorage.setItem("errorStatus", JSON.stringify(false));

            movieDetails = {
                Title: res.Title,
                Poster: res.Poster,
                Released: res.Released,
                Runtime: res.Runtime,
                Plot: res.Plot,
                Genre: res.Genre,
                Director: res.Director,
                Writer: res.Writer,
                Actors: res.Actors,
                Language: res.Language,
                Country: res.Country,
                Awards: res.Awards,
                imdbRating: res.imdbRating,
                BoxOffice: res.BoxOffice
            }

            localStorage.setItem("movieDetails", JSON.stringify(movieDetails));
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

const handleComment = (event) => {
    let text = event.target.value;
    commentText = text;
    localStorage.setItem("commentText", commentText);
}

const viewMovieDetails = async (event) => {
    document.getElementById("mainContainer").innerHTML = loader;
    const index = parseInt(event.target.id);
    let movies = JSON.parse(localStorage.getItem("moviesList"));
    let imdbID = movies[index].imdbID;
    await fetchMovieDetails(imdbID);
    updateMovieDetailsHTML();
}

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
    
    const movieItems = document.getElementsByClassName("movieListItem");
    for(let movie of movieItems){
        movie.addEventListener("click", viewMovieDetails); 
    };
}

const addFunctionalitiesForMovieDetails = () => {
    const radioInputs = document.querySelectorAll('input[type="radio"]');

  radioInputs.forEach(function(radio) {
    radio.addEventListener('change', function() {
      console.log('New star rating: ' + this.value);
    });
  });

  const addComment = document.getElementById("commentInput");
  addComment.addEventListener("input", handleComment);
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
                    <img id="${index}" alt="poster" src="${poster}" class="movieListPoster" />
                    <div id="${index}" class="movieListTitle">${truncateTitle}</div>
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
    if(!localStorage.getItem("commentText")){
        localStorage.setItem("commentText", JSON.stringify(commentText));
    }else{
        commentText = localStorage.getItem("commentText");
    }
    if(!localStorage.getItem("starRating")){
        localStorage.setItem("starRating", JSON.stringify(starRating));
    }else{
        starRating = JSON.parse(localStorage.getItem("starRating"));
    }
    if(!localStorage.getItem("movieDetails")){
        localStorage.setItem("movieDetails", JSON.stringify(movieDetails));
    }else{
        movieDetails = JSON.parse(localStorage.getItem("movieDetails"));
    }
    
    localStorage.setItem("pageNum", JSON.stringify(1));
    // await fetchMovies("marvel", 1);
    updateMoviesListHTML();

}








const updateMovieDetailsHTML = () => {
    const upperHTML =`
    <div id="movieDetailsMainContainer">
            <div id="titleMovieDetails">${movieDetails.Title}</div>
            <div id="movieDetailsSection">
                <img src="${movieDetails.Poster}" />
                <div id="movieDetails">`;
    const lowerHTML = `
    </div>
            </div>
            <div class="userInputMovieDetails" id="yourRating">
                <label>Your Rating: </label>
                ${starInput}
            </div>
            <div id="yourComment">
                <label>Your Comment: </label>
                <input id="commentInput" type="text-area" value="${commentText}" placeholder="Write your Review..." />
            </div>
        </div>`;

    let movieDetailsItemsHTML = "";

    for(let key in  movieDetails) {
        if(key !== "Title" && key !== "Poster"){
            movieDetailsItemsHTML += `
            <div class="movieDetailsItem">
                <div class="movieDetailsItemHeading">${key}:</div>
                <div class="movieDetailsItemValue">${movieDetails[key]}</div>
            </div>`
        }
    };

    const totalHTML = upperHTML + movieDetailsItemsHTML + lowerHTML;
    document.getElementById("mainContainer").innerHTML = totalHTML;
    addFunctionalitiesForMovieDetails();
}

document.addEventListener("DOMContentLoaded", function () {
    intitialize();
});