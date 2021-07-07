
const getSeedData = () => {
    const endpoint = `https://raw.githubusercontent.com/tabatkins/recipe-db/master/db-recipes.json`

    const data = await fetch(endpoint)

    const recipeData = await data.json()

    return recipeData
}

//Todo: Crea