"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";

import socket from "../socket";

export default function JoinGame({ handleJoin }) {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    socket.on("connect_error", (err) => {
      setError(
        "room",
        { type: "custom", message: err.message },
        { shouldFocus: true }
      );
    });
  }, [socket]);

  return (
    <form
      className="mt-2 flex flex-col items-center"
      onSubmit={handleSubmit(handleJoin)}
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
      <div className="mt-2">
        <label htmlFor="room" className="block pl-4  text-[#999] mb-1 ">
          Room ID
        </label>
        <input
          type="text"
          name="room"
          id="room"
          className={`block w-full rounded-[45px] border-[#999] px-4 shadow-sm ${
            errors.room
              ? "focus:border-red-300 focus:ring-red-300 border-red-300"
              : "focus:border-[#8bbbb4] focus:ring-[#8bbbb4] border-[#999]"
          }  bg-[#565b6d] text-white`}
          placeholder="enter room id"
          {...register("room", { required: "Room ID is required" })}
        />
        {errors.room && (
          <p className="block pl-3 text-red-300 mt-1 ">{errors.room.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="[ mt-8 w-full py-3 rounded-[45px] in-flex ] 
                           [ font-bold text-white ] 
                           [ bg-gradient-to-r from-[#8ebab7] 
                             to-[#3a525c] 
                             hover:bg-gradient-to-r 
                             hover:from-[#3a525c] 
                             hover:to-[#8ebab7]  ] 
                           [ shadow-clay-btn ]"
      >
        Join
      </button>
    </form>
  );
}
