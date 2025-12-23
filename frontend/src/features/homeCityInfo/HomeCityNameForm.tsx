import { FieldValues, useForm } from 'react-hook-form';
import { useAddHomeCity } from './hooks/useAddHomeCity';

export const HomeCityNameForm = () => {
  const { register, handleSubmit } = useForm();
  const { mutate: addHomeCity, isPending } = useAddHomeCity();

  const onSubmit = (data: FieldValues) => {
    addHomeCity(data.homeCity);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Home City"
          required
          {...register('homeCity')}
        />
        <button type="submit" disabled={isPending}>
          Submit
        </button>
      </form>
    </div>
  );
};
