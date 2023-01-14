"use client";

import { useForm } from "react-hook-form";

export default function CreateGame({ handleCreate }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      className="mt-2 flex flex-col items-center"
      onSubmit={handleSubmit(handleCreate)}
    >
      <div>
        <label htmlFor="username" className="block pl-3 text-[#999] mb-1 ">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className={`block w-full rounded-[45px]  px-4 shadow-sm ${
            errors.username
              ? "focus:border-red-300 focus:ring-red-300 border-red-300"
              : "focus:border-[#8bbbb4] focus:ring-[#8bbbb4] border-[#999]"
          }  bg-[#565b6d] text-white`}
          placeholder="enter username"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <p className="block pl-3 text-red-300 mt-1 ">Username is required</p>
        )}
      </div>
      <button
        type="submit"
        className="[ mt-8 w-full py-3 rounded-[45px] in-flex  ] 
        [ font-bold text-white ] 
        [ bg-[#698a87] 
        hover:bg-[#566D6B]  ] 
        [ shadow-clay-btn ]"
      >
        Create
      </button>
    </form>
  );
}
