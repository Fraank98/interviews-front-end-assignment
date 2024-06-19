import { UseFormReturn } from 'react-hook-form';
import { FormData } from './AddRecipeForm';

export default function ImageInput({
  imageUrl,
  setImageUrl,
  methods,
}: {
  imageUrl: string | null;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<FormData, any, undefined>;
}) {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <p className='text-text-primary'>Recipe Image</p>
      <label
        htmlFor='file'
        className='row-start-2 flex h-12 w-full max-w-48 items-center justify-evenly self-center rounded-primary bg-input-bg p-1 shadow-default'
      >
        <span className='text-center text-text-primary'>
          {' '}
          {imageUrl ? 'Ok!' : 'Choose an image'}
        </span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          className='w-6 stroke-primary'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
          />
        </svg>
      </label>
      <input
        id='file'
        required
        type='file'
        accept='image/*'
        {...methods.register('image')}
        className='absolute -z-10 opacity-0'
        onChange={(e) =>
          e.target.files?.[0] &&
          setImageUrl(URL.createObjectURL(e.target.files?.[0]))
        }
      />
      {imageUrl && (
        <img className='col-start-2 row-start-2' src={imageUrl} alt='' />
      )}
    </div>
  );
}