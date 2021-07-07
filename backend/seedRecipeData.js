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
            ingredients: joinArrayAsFormattedString(recipeData[recipeId].ingredients),
            instructions: recipeData[recipeId].instructions,
            tags: joinArrayAsFormattedString(recipeData[recipeId].tags)
        }
        recipesArray.push(recipe)
    }
    return recipesArray
}

const joinArrayAsFormattedString = (array) => {
    return array.join(', ')
}

formatData()

console.log(joinArrayAsFormattedString(test))