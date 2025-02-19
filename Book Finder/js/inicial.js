const BASE_URL = "http://localhost:8080";

const catalogSection = document.getElementById("catalog");
const searchSection = document.getElementById("search");
const catalogLink = document.getElementById("catalogLink");
const searchLink = document.getElementById("searchLink");
const searchError = document.getElementById("searchError");
const filteredChip = document.getElementById("filtered-chip");

const filterChipButtons = document.querySelectorAll(".filter-chip");

let currentFilter = "";

// Carrega o catálogo de livros
function loadCatalog() {
    console.log("Carregando catálogo de livros...");

    fetch(`${BASE_URL}/api/books`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8080',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    })
    .then(data => {
        const booksList = document.getElementById("booksList");
        booksList.innerHTML = "";

        data.forEach(book => {
            const card = createBookCard(book);
            booksList.appendChild(card);
        });
    });
}

// Busca livros por título (poderia ser estendido para autor/gênero)
async function searchBooks(query) {
    // let newQuery = `${currentFilter}:${query}`;
    console.log("Buscando livros por título...", query);

    fetch(`${BASE_URL}/api/books/search/${query}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8080',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
    })
    .then(response => {
        searchError.style.display = "none";

        if (!response.ok) {
            searchError.style.display = "block";
            searchError.textContent = "Livro não encontrado";

            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    })
    .then(data => {
        const results = document.getElementById("searchResults");
        results.innerHTML = "";

        if (Array.isArray(data)) {
            data.forEach(book => {
                const card = createBookCard(book);
                results.appendChild(card);
            });
        }
        else results.appendChild(createBookCard(data));
    });
}

function createBookCard(book) {
    const card = document.createElement("div");
    const title = document.createElement("h3");
    const author = document.createElement("p");
    const categories = document.createElement("p");

    card.className = "book-card";
    title.textContent = book.title;
    author.textContent = "Autor: " + book.author.name;
    categories.textContent = "Categorias: " + book.categories.map(category => category.name).join(", ");

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(categories);

    // const year = document.createElement("p");
    // year.textContent = "Ano: " + book.year;
    // const synopsis = document.createElement("p");
    // synopsis.textContent = book.synopsis;
    // card.appendChild(year);
    // card.appendChild(synopsis);

    // Aqui você pode adicionar mais detalhes, como autores e categoria, se desejar.
    return card;
}

/**
 * Atualiza o valor atual do filtro e ajusta a visibilidade e texto do chip de filtro.
 * @param {string} filter valor do filtro atual
 */
function setCurrentFilter(filter) {
    currentFilter = filter;

    if (currentFilter.length > 0)
        filteredChip.classList.remove("hidden");
    else
        filteredChip.classList.add("hidden");

    filteredChip.textContent = `${currentFilter}:`;
}

function setupFilterChips() {
    filterChipButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            if (currentFilter === button.getAttribute("data-filter")) {
                setCurrentFilter("");
                return;
            }

            setCurrentFilter(button.getAttribute("data-filter"));
        });
    });

    filteredChip.addEventListener("click", () => setCurrentFilter(""));
}

catalogLink.addEventListener("click", async function(e) {
    e.preventDefault();
    catalogSection.style.display = "block";
    searchSection.style.display = "none";
    await loadCatalog();
});

searchLink.addEventListener("click", function(e) {
    e.preventDefault();
    catalogSection.style.display = "none";
    searchSection.style.display = "block";
});

document.getElementById("searchForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const query = document.getElementById("searchInput").value;
    await searchBooks(query);
});

// Inicializa carregando o catálogo
(async () => {
    await loadCatalog();

    // setupFilterChips();
})();
