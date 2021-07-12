SELECT ROUND(AVG(rating), 2)::float AS average_rating FROM recipe_rating WHERE recipe_id = 665180 AND created_at = (SELECT MAX(created_at) FROM recipe_rating WHERE user_id = 2);

SELECT ROUND(AVG(rating), 2)::float AS average_rating FROM recipe_rating WHERE recipe_id = 665180 AND created_at = (SELECT MAX(created_at) FROM recipe_rating);

SELECT ROUND(AVG(rating), 2)::float AS average_rating 
FROM recipe_rating 
WHERE recipe_id = 665180 
AND created_at = (SELECT MAX(created_at) FROM recipe_rating) 
GROUP BY user_id;

SELECT recipe_rating.user_id, recipe_rating.recipe_id, recipe_rating.created_at, t.most_recent
FROM (
    SELECT 
)

SELECT user_id, recipe_id, AVG(rating)
    FROM recipe_rating
    WHERE created_at = (SELECT GREATEST(created_at) FROM recipe_rating)
    GROUP BY user_id;