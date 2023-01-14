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
      className="my-6 flex flex-col items-center"
      onSubmit={handleSubmit(handleWord)}
    >
      <div>
        <label htmlFor="word" className="block pl-3 text-[#999] mb-1">
          Word
        </label>
        <input
          type="text"
          name="word"
          id="word"
          className={`block w-full rounded-[45px]  px-4 shadow-sm ${
            errors.username
              ? "focus:border-red-300 focus:ring-red-300 border-red-300"
              : "focus:border-[#8bbbb4] focus:ring-[#8bbbb4] border-[#999]"
          }  bg-[#565b6d] text-white`}
          placeholder="enter a word"
          {...register("word", { required: true })}
        />
        {errors.word && (
          <p className="block pl-3 text-red-300 mt-1">Word is required</p>
        )}
      </div>
      <button
        type="submit"
        className="[ mt-8 w-full py-3 rounded-[45px] in-flex  ] 
                           [ font-bold text-white ] 
                           [ bg-[#698a87] 
                           hover:bg-[#566D6B]  ] 
                           "
      >
        Enter
      </button>
    </form>
  );
}
