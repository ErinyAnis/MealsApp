import MealItem from './meal-item';
import classes from './meals-grid.module.css';

export default function MealsGrid({ meals }) {
  console.log(meals); // Log the meals data to ensure it's correct
  return (
    <ul className={classes.meals}>
      {meals.map(meal => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
