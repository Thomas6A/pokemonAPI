document.addEventListener('DOMContentLoaded', async function () {

    let page = 1
    let next = document.querySelector('.next')
    let previous = document.querySelector('.previous')
    document.getElementById('searchButton').addEventListener('click', searchPokemon);
    document.getElementById('searchButtonType').addEventListener('click', searchType);

    await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0", "GET", printPokemon)

    function fetch(url, method, fun) {
        const request = new XMLHttpRequest();
        request.addEventListener("load", fun)
        request.open(method, url);
        request.setRequestHeader('Accept', "application/json")
        request.send()
    }

    function printPokemon() {
        let result = JSON.parse(this.response);
        for (let i = 0; i < result.results.length; i++) {
            let li = document.createElement('li');
            let link = document.createElement('a')
            link.href = "#"
            link.innerHTML = 'id : ' + (i + 1 + 20 * (page - 1)) + ' Nom : ' + result.results[i].name;
            link.addEventListener('click', function () {
                detailPokemon(result.results[i].name)
            })
            li.append(link)
            document.getElementById('jokes').append(li);
        }
    }

    next.addEventListener('click', nextPage)
    previous.addEventListener('click', previousPage)
    function nextPage() {
        document.getElementById('jokes').textContent = ''
        offset = page * 20
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=" + offset, "GET", printPokemon)
        page += 1
    }

    function previousPage() {
        document.getElementById('jokes').textContent = ''
        page -= 1
        if (page <= 1) {
            offset = 0
            page = 1
        } else {
            offset = (page - 1) * 20
        }
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=" + offset, "GET", printPokemon)

    }

    function detailPokemon(name) {
        fetch("https://pokeapi.co/api/v2/pokemon/" + name, "GET", function () {
            let pokemon = JSON.parse(this.response)
            document.getElementsByClassName('detail')[0].innerHTML = ''
            
            document.getElementsByClassName('detail')[0].innerHTML += pokemon.name + '<br>'
            for (let i = 0; i < pokemon.types.length; i++) {
                document.getElementsByClassName('detail')[0].innerHTML += pokemon.types[i].type.name + ' '
            }
            document.getElementsByClassName('detail')[0].innerHTML += '<br>'
            for (let i = 0; i < pokemon.stats.length; i++) {
                document.getElementsByClassName('detail')[0].innerHTML += pokemon.stats[i].stat.name + ' : ' + pokemon.stats[i].base_stat + '<br>'
            }
            let img = document.createElement('img')
            img.src = pokemon.sprites.front_default
            document.getElementsByClassName('detail')[0].append(img)
        })
    }

    function searchPokemon() {
        let searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (searchTerm === '') {
            document.getElementById('jokes').textContent = '';
            fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0", "GET", printPokemon);
        } else {
            fetch("https://pokeapi.co/api/v2/pokemon/?limit=1118", "GET", function () {
                let result = JSON.parse(this.response);
                let filteredResults = result.results.filter(pokemon => pokemon.name.includes(searchTerm));
                document.getElementById('jokes').textContent = '';
                filteredResults.forEach(pokemon => {
                    let li = document.createElement('li');
                    let link = document.createElement('a');
                    link.href = "#";
                    link.innerHTML = 'id : ' + (filteredResults.indexOf(pokemon) + 1) + ' Nom : ' + pokemon.name;
                    link.addEventListener('click', function () {
                        detailPokemon(pokemon.name);
                    });
                    li.append(link);
                    document.getElementById('jokes').append(li);
                });
            });
        }

    }

    function searchType() {
        let searchTerm = document.getElementById('searchType').value.toLowerCase();
        if (searchTerm === '') {
            document.getElementById('jokes').textContent = '';
            fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0", "GET", printPokemon);
        } else {
            fetch("https://pokeapi.co/api/v2/type/" + searchTerm, "GET", function () {
                let result = JSON.parse(this.response);
                let pokemonUrls = result.pokemon.map(pokemon => pokemon.pokemon.url);
                document.getElementById('jokes').textContent = '';
                pokemonUrls.forEach(url => {
                    fetch(url, "GET", function () {
                        let pokemon = JSON.parse(this.response);
                        let li = document.createElement('li');
                        let link = document.createElement('a');
                        link.href = "#";
                        link.innerHTML = 'id : ' + pokemon.id + ' Nom : ' + pokemon.name;
                        link.addEventListener('click', function () {
                            detailPokemon(pokemon.name);
                        });
                        li.append(link);
                        document.getElementById('jokes').append(li);
                    });
                });
            });
        }
    }

    
})