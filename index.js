(function () {
    // write your code here
    const BASE_URL = 'https://movie-list.alphacamp.io'
    const INDEX_URL = BASE_URL + '/api/v1/movies/'
    const POSTER_URL = BASE_URL + '/posters/'
    const data = []
    //index.api
    axios.get(INDEX_URL).then((response) => {
        data.push(...response.data.results)
        displayDataList(data)
        getTotalPages(data)
        getPageData(1, data)
    }).catch((err) => console.log(err))
    const dataPanel = document.getElementById('data-panel')
    dataPanel.addEventListener('click', (event) => {
        if (event.target.matches('.btn-show-movie')) {
            showMovie(event.target.dataset.id)
        } else if (event.target.matches('.btn-add-favorite')) {
            addFavoriteItem(event.target.dataset.id)
        }

    })
    function displayDataList(data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
            htmlContent += `
          <div class="col-sm-3">
            <div class="card mb-2">
              <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
              <div class="card-body movie-item-body">
                <h6 class="card-title">${item.title}</h6>
              </div>
                <!-- "More" button -->
                <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                <!-- favorite button --> 
<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                </div>
            </div>
          </div>
        `
        })
        dataPanel.innerHTML = htmlContent
    }
    // bar layout
    function displayDataListTable(data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
            htmlContent += `
          <tr><td>${item.title}</td>
          <td><button class="btn btn-primary btn-show-movie ml-auto" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button></td>
           <td><button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button></td>
          </tr>
      `
        })
        dataPanel.innerHTML = `<table class="table table-hover table-bordered table-striped" id="movieData"><tbody>${htmlContent}</tbody></table>`
    }
    function showMovie(id) {
        const modalTitle = document.getElementById('show-movie-title')
        const modalImage = document.getElementById('show-movie-image')
        const modalDate = document.getElementById('show-movie-date')
        const modalDescription = document.getElementById('show-movie-description')
        //show api
        const url = INDEX_URL + id
        axios.get(url).then((response) => {
            const data = response.data.results
            modalTitle.textContent = data.title
            modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
            modalDate.textContent = `release at : ${data.release_date}`
            modalDescription.textContent = `${data.description}`
        }).catch((err) => console.log(err))
    }
    //search
    const searchForm = document.getElementById('search-bar')
    const searchInput = document.getElementById('search-input')
    // listen to search form submit event
    searchForm.addEventListener('submit', event => {
        event.preventDefault()

        let results = []
        const regex = new RegExp(searchInput.value, 'i')

        results = data.filter(movie => movie.title.match(regex))
        // displayDataList(results)
        getTotalPages(results)
        getPageData(1, results)
    })
    function addFavoriteItem(id) {
        const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
        const movie = data.find(item => item.id === Number(id))

        if (list.some(item => item.id === Number(id))) {
            alert(`${movie.title} is already in your favorite list.`)
        } else {
            list.push(movie)
            alert(`Added ${movie.title} to your favorite list!`)
        }
        localStorage.setItem('favoriteMovies', JSON.stringify(list))
    }
    //pagination
    const pagination = document.getElementById('pagination')
    const ITEM_PER_PAGE = 12

    function getTotalPages(data) {
        let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
        let pageItemContent = ''
        for (let i = 0; i < totalPages; i++) {
            pageItemContent += `
            <li class="page-item">
              <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
            </li>
          `
        }
        pagination.innerHTML = pageItemContent
    }
    // listen to pagination click event
    pagination.addEventListener('click', event => {
        console.log(event.target.dataset.page)
        if (event.target.tagName === 'A') {
            getPageData(event.target.dataset.page)
        }
    })
    let paginationData = []
    function getPageData(pageNum, data) {
        paginationData = data || paginationData
        let offset = (pageNum - 1) * ITEM_PER_PAGE
        let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)

        searchForm.addEventListener('click', event => {
            if (event.target.matches('.fa-bars')) {
                displayDataListTable(pageData)
            } else if (event.target.matches('.fa-th')) {
                displayDataList(pageData)
            }
        })
        if (document.getElementById('movieData')) {
            displayDataListTable(pageData)
        } else {
            displayDataList(pageData)
        }
    }
})()