document.addEventListener("DOMContentLoaded", async function () {
  let dernierPokemon = 0;
  let gen_actuelle = 0;
  let plus = document.getElementById("plus");

  await fetch("https://pokeapi.co/api/v2/generation/1", "GET", printPokemon);
  await detailPokemon("bulbasaur");

  document
    .getElementById("searchButton")
    .addEventListener("click", searchPokemon);

  plus.addEventListener("click", function () {
    fetch(
      "https://pokeapi.co/api/v2/generation/" + (gen_actuelle + 1),
      "GET",
      printPokemon
    );
  });

  await fetch("https://pokeapi.co/api/v2/generation", "GET", function () {
    let result = JSON.parse(this.response);
    let n = 0;
    result.results.forEach((generation) => {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.href = "#";
      a.innerHTML = generation.name;
      li.append(a);
      li.classList.add("gen");
      if (n === 0) {
        li.classList.add("selected");
      }

      document.getElementById("listeGen").append(li);
      n += 1;
    });
    let gen = document.getElementsByClassName("gen");
    generation(gen);
  });

  function generation(gen) {
    for (let i = 0; i < gen.length; i++) {
      gen[i].addEventListener("click", function () {
        document
          .getElementsByClassName("selected")[0]
          .classList.remove("selected");
        dernierPokemon = 0;
        gen[i].classList.add("selected");
        document.getElementById("jokes").innerHTML = "";
        fetch(
          "https://pokeapi.co/api/v2/generation/" + (i + 1),
          "GET",
          printPokemon
        );
        gen_actuelle = i;
      });
    }
  }

  function fetch(url, method, fun) {
    const request = new XMLHttpRequest();
    request.addEventListener("load", fun);
    request.open(method, url);
    request.setRequestHeader("Accept", "application/json");
    request.send();
  }

  function printPokemon() {
    let result = JSON.parse(this.response);
    result.pokemon_species.sort((a, b) => {
      let pokemonIdA = parseInt(a.url.split("/").filter(Boolean).pop());
      let pokemonIdB = parseInt(b.url.split("/").filter(Boolean).pop());
      return pokemonIdA - pokemonIdB;
    });
    const limite = 10;
    let fin_index = dernierPokemon + limite;
    if (fin_index > result.pokemon_species.length) {
      fin_index = result.pokemon_species.length;
    }
    for (let i = dernierPokemon; i < fin_index; i++) {
      let li = document.createElement("li");
      let link = document.createElement("a");
      link.href = "#";
      let pokemonId = result.pokemon_species[i].url
        .split("/")
        .filter(Boolean)
        .pop();
      let img = document.createElement("img");
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
      link.append(img);
      let span = document.createElement("span");
      span.innerHTML += "#" + pokemonId + " ";
      span.innerHTML += result.pokemon_species[i].name;
      link.append(span);
      link.addEventListener("click", function () {
        detailPokemon(result.pokemon_species[i].name);
      });
      li.append(link);
      document.getElementById("jokes").append(li);
    }
    dernierPokemon = fin_index;
  }

  function searchPokemon() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    fetch(
      "https://pokeapi.co/api/v2/generation/" + (gen_actuelle + 1),
      "GET",
      function () {
        let result = JSON.parse(this.response);
        let filteredResults;
        if (isNaN(searchTerm)) {
          filteredResults = result.pokemon_species.filter((pokemon_species) =>
            pokemon_species.name.includes(searchTerm)
          );
        } else {
          filteredResults = result.pokemon_species.filter(
            (pokemon_species) =>
              pokemon_species.url.split("/").filter(Boolean).pop() ===
              searchTerm
          );
        }
        document.getElementById("jokes").textContent = "";
        filteredResults.forEach((pokemon_species) => {
          let li = document.createElement("li");
          let link = document.createElement("a");
          let pokemonId = pokemon_species.url.split("/").filter(Boolean).pop();
          link.href = "#";
          let img = document.createElement("img");
          img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
          link.append(img);
          link.innerHTML += "#" + pokemonId + " ";
          link.innerHTML += pokemon_species.name;
          link.addEventListener("click", function () {
            detailPokemon(pokemon_species.name);
          });
          li.append(link);
          document.getElementById("jokes").append(li);
        });
      }
    );
  }

  async function detailPokemon(name) {
    document.getElementById("detail").innerHTML = "";
    fetch("https://pokeapi.co/api/v2/pokemon/" + name, "GET", function () {
      let result = JSON.parse(this.response);
      let pokemonId = result.id;
      if (pokemonId === 1) {
        fetch(
          "https://pokeapi.co/api/v2/pokemon-species?limit=10000",
          "GET",
          function () {
            let result = JSON.parse(this.response);
            taille = result.results.length;
            autrePokemon(taille, "avant");
          }
        );
      } else {
        autrePokemon(pokemonId - 1, "avant");
      }
      let div = document.createElement("div");
      let h2 = document.createElement("h2");
      h2.textContent = result.name + " #" + pokemonId;
      div.append(h2);
      let img = document.createElement("img");
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
      div.append(img);
      div.classList.add("principal");
      document.getElementById("detail").append(div);
      if (pokemonId === 1010) {
        autrePokemon(1, "apres");
      } else {
        autrePokemon(pokemonId + 1, "apres");
      }

      let divType = document.createElement("div");
      let h4 = document.createElement("h4");
      h4.textContent = "Type";
      divType.append(h4);
      let listeType = document.createElement("ul");
      result.types.forEach((type) => {
        let liType = document.createElement("li");
        liType.textContent = type.type.name;
        liType.classList.add(type.type.name);
        listeType.append(liType);
      });
      divType.append(listeType);
      divType.classList.add("Type");
      document.getElementById("detail").append(divType);

      let divDesc = document.createElement("div");

      let articleHeight = document.createElement("article");
      let h5Height = document.createElement("h5");
      let pHeight = document.createElement("p");
      h5Height.textContent = "Height : ";
      pHeight.textContent = result.height;
      articleHeight.append(h5Height);
      articleHeight.append(pHeight);
      divDesc.append(articleHeight);

      let articleWeight = document.createElement("article");
      let h5Weight = document.createElement("h5");
      let pWeight = document.createElement("p");
      h5Weight.textContent = "Weight : ";
      pWeight.textContent = result.weight;
      articleWeight.append(h5Weight);
      articleWeight.append(pWeight);
      divDesc.append(articleWeight);

      let articleAbilities = document.createElement("article");
      let h5Abilities = document.createElement("h5");
      h5Abilities.textContent = "Abilities : ";
      let listeAbilities = document.createElement("ul");
      result.abilities.forEach((ability) => {
        let liAbility = document.createElement("li");
        liAbility.textContent = ability.ability.name;
        listeAbilities.append(liAbility);
      });
      articleAbilities.append(h5Abilities);
      articleAbilities.append(listeAbilities);
      divDesc.append(articleAbilities);
      divDesc.classList.add("Desc");
      document.getElementById("detail").append(divDesc);

      let divWeakness = document.createElement("div");
      let h4Weakness = document.createElement("h4");
      h4Weakness.textContent = "Weakness";
      divWeakness.append(h4Weakness);
      let listWeakness = document.createElement("ul");
      result.types.forEach((type) => {
        fetch(
          "https://pokeapi.co/api/v2/type/" + type.type.name,
          "GET",
          function () {
            let result = JSON.parse(this.response);
            result.damage_relations.double_damage_from.forEach((type) => {
              let liWeakness = document.createElement("li");
              liWeakness.textContent = type.name;
              liWeakness.classList.add(type.name);
              listWeakness.append(liWeakness);
            });
          }
        );
      });
      divWeakness.append(listWeakness);
      divWeakness.classList.add("Weak");
      document.getElementById("detail").append(divWeakness);
    });
  }

  function autrePokemon(id, string) {
    fetch("https://pokeapi.co/api/v2/pokemon/" + id, "GET", function () {
      let result = JSON.parse(this.response);
      let pokemonId = result.id;
      let div = document.createElement("div");
      let link = document.createElement("a");
      link.href = "#";
      let h3 = document.createElement("h3");
      h3.textContent = result.name + " #" + pokemonId;
      link.append(h3);
      let img = document.createElement("img");
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
      link.append(img);
      div.append(link);
      div.classList.add(string);
      link.addEventListener("click", function () {
        detailPokemon(result.name);
      });
      document.getElementById("detail").append(div);
    });
  }
  async function getAllPokemon(taille) {}
});
