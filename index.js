document.addEventListener('DOMContentLoaded', async function () {

    let page = 1
    let next = document.querySelector('.next')
    let previous = document.querySelector('.previous')

    await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0", "GET", printPokemon)

    // fetchRandomJoke(request)

    function fetch(url, method, fun) {
        //Initialisation de XHR
        const request = new XMLHttpRequest();
        request.addEventListener("load", fun)
        //Spécifier le type d'appelle [ GET, POST, PUT, PATCH, DELETE ] et l'URL
        request.open(method, url);
        //Spécification que je veux du JSON en type de retour
        request.setRequestHeader('Accept', "application/json")
        //Permet d'envoyer la requêtes
        request.send()
    }

    function printPokemon() {
        //Je parse/converti mon objet en JSON pour appeler les attributs de l'objet
        let result = JSON.parse(this.response);
        //Je boucle sur le tableau de résultat
        for (let i = 0; i < result.results.length; i++) {
            //Je crée mon <li></li>
            let li = document.createElement('li');
            // Je met la valeut de ma blague dans mob li
            li.innerHTML = result.results[i].name;
            //Je push/pousser mon li dans mon Ul qui a pour id 'jokes'
            document.getElementById('jokes').append(li);
    }}
    
    next.addEventListener('click', nextPage)
    previous.addEventListener('click', previousPage)

    function nextPage(){
        document.getElementById('jokes').textContent = ''
        offset = page*20
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset="+offset, "GET", printPokemon)
        page += 1
    }

    function previousPage(){
        document.getElementById('jokes').textContent = ''
        page -= 1
        offset = (page-1)*20
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset="+offset, "GET", printPokemon)
        
    }

})