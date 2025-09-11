const Input = ({ label, type, register, error, ...rest }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={register.name} className="w-fit text-lg font-black">
        {label}
      </label>

      <div className="flex flex-col items-center">
        <input
          id={register.name}
          type={type}
          {...rest}
          {...register}
          className={`peer w-full px-1.5 pt-2.5 pb-1 text-left text-lg font-bold outline-0 ${
            error ? 'focus:outline-red-500' : ''
          }`}
        />

        <span
          className={`before:content-[], relative h-[2px] w-full transition-colors duration-150 before:absolute before:h-[2px] before:w-0 before:transition-all before:duration-500
            ${
              error
                ? 'bg-red-500'
                : 'bg-[rgba(0,0,0,0.25)]'
            }
            ${
              error
                ? 'peer-focus-within:before:bg-red-500'
                : 'peer-focus-within:before:bg-[#6EAA38]'
            }
          `}
        ></span>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default Input;