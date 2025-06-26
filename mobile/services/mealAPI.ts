const BASE_URL = "https://www.themealdb.com/api/json/v1/1";


export const MealApi = {
    searchMealsByName: async (query: string) => {
        try {
            const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
            const data = await res.json()
            return data.meals || []
        } catch (error) {
            console.error("Error searching meals by name", error);
            return []
        }
    },


    getMealById: async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
            const data = await res.json()
            return data.meals ? data.meals[0] : null
        } catch (error) {
            console.error("Error getting meal by id :", error);
            return null
        }
    },


    getRandomMeal: async () => {
        try {
            const res = await fetch(`${BASE_URL}/random.php`);
            const data = await res.json()
            return data.meals ? data.meals[0] : null
        } catch (error) {
            console.error("Error getting random meal", error);
            return null
        }
    },


    getRandomMeals: async (count: number = 6) => {
        try {
            const promises = Array(count)
                .fill(null)
                .map(() => MealApi.getRandomMeal())
            const meals = await Promise.all(promises)
            return meals.filter((meal) => meal !== null)
        } catch (error) {
            console.error("Error getting random meals", error);
            return []
        }
    },


    getCategories: async () => {
        try {
            const res = await fetch(`${BASE_URL}/categories.php`);
            const data = await res.json()
            return data.categories || []
        } catch (error) {
            console.error("Error getting categories", error);
            return []
        }
    },


    filterByIngredient: async (ingredient: any) => {
        try {
            const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
            const data = await res.json()
            return data.meals || []
        } catch (error) {
            console.error("Error Filter By Ingredient", error);
            return []
        }
    },



    filterByCategory: async (category: any) => {
        try {
            const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(category)}`);
            const data = await res.json()
            return data.meals || []
        } catch (error) {
            console.error("Error Filter By Category", error);
            return []
        }
    },




    // transform TheMealDB meal data to our app format
    transformMealData: (meal: any) => {
        if (!meal) return null;

        // extract ingredients from the meal object
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                const measureText = measure && measure.trim() ? `${measure.trim()} ` : "";
                ingredients.push(`${measureText}${ingredient.trim()}`);
            }
        }

        // extract instructions
        const instructions = meal.strInstructions
            ? meal.strInstructions.split(/\r?\n/).filter((step: any) => step.trim())
            : [];

        return {
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions
                ? meal.strInstructions.substring(0, 120) + "..."
                : "Delicious meal from TheMealDB",
            image: meal.strMealThumb,
            cookTime: "30 minutes",
            servings: 4,
            category: meal.strCategory || "Main Course",
            area: meal.strArea,
            ingredients,
            instructions,
            originalData: meal,
        };
    },
}