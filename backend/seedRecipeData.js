
const getSeedData = async () => {
    const endpoint = `https://raw.githubusercontent.com/tabatkins/recipe-db/master/db-recipes.json`

    const data = await fetch(endpoint)

    const recipeData = await data.json()

    return recipeData
}

//Todo: name instructions, ingredients, tags


const formatData = async () => {

    const recipeData = await getSeedData()

    const recipesArray = []
    
    for(let recipeId in recipeData){
        const recipe = {
            name: recipeData[recipeId].name,
            ingredients: recipeData[recipeId].ingredients,
            instructions: recipeData[recipeId].instructions,
            tage: recipeData[recipeId].tags
        }
        recipesArray.push(recipe)
    }
    return recipesArray
}

formatData()