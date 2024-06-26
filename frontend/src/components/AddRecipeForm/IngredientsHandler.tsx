import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form';
import { FormData } from './AddRecipeForm';

export default function IngredientsHandler({
  ingredients,
  append,
  remove,
}: {
  ingredients: FieldArrayWithId<FormData, 'ingredients', 'id'>[];
  append: UseFieldArrayAppend<FormData, 'ingredients'>;
  remove: UseFieldArrayRemove;
}) {
  const form = useFormContext();
  return (
    <div className='grid w-full gap-2'>
      <p className='text-text-primary'>Main Ingredients</p>
      {ingredients.map((ingredient, index) => (
        <div
          key={ingredient.id}
          className='relative flex w-full items-center justify-center gap-1'
        >
          <Controller
            control={form.control}
            name={`ingredients.${index}.value`}
            defaultValue={ingredient.value}
            rules={{
              required: 'Ingredient cannot be empty',
              pattern: {
                value: /^[a-zA-Z ]*$/,
                message: 'Only letters are allowed',
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <input
                  data-testid={`new-ingredient-${index}`}
                  {...field}
                  required
                  className='h-12 w-full resize-none rounded-primary bg-input-bg p-1 pl-3 shadow-default'
                  type='text'
                  placeholder='Ingredient'
                />
                {error && (
                  <p className='absolute -bottom-6 text-red-500'>
                    {error.message}
                  </p>
                )}
              </>
            )}
          />
          <button
            type='button'
            onClick={() => remove(index)}
            className='flex h-full w-14 items-center justify-center rounded-primary shadow-default'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='red'
              className='w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
              />
            </svg>
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={() => append({ value: '' })}
        className='flex h-12 w-16 items-center justify-center rounded-element bg-primary text-text-secondary shadow-default'
      >
        Add +
      </button>
    </div>
  );
}
