"use client";

import { useForm } from "react-hook-form";

export default function WordInput({ handleWord }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      className="mt-5 sm:flex sm:items-center"
      onSubmit={handleSubmit(handleWord)}
    >
      <div className="w-full sm:max-w-xs">
        <label htmlFor="word" className="sr-only">
          Word
        </label>
        <input
          type="text"
          name="word"
          id="word"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="enter word"
          {...register("word", { required: true })}
        />
        {errors.word && <p>Word is required</p>}
      </div>
      <button
        type="submit"
        className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Enter
      </button>
    </form>
  );
}
