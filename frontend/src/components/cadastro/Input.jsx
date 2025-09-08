const Input = ({ label, type, name, value, onChange, ...rest }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={name} className="w-fit text-lg font-black">
        {label}
      </label>

      <div className="flex flex-col items-center">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          {...rest}
          className="peer w-full px-1.5 pt-2.5 pb-1 text-left text-lg font-bold outline-0"
        />

        <span className="before:content-[], relative h-[2px] w-full bg-[rgba(0,0,0,0.25)] transition-colors duration-150 before:absolute before:h-[2px] before:w-0 before:transition-all before:duration-500 peer-focus-within:before:w-full peer-focus-within:before:bg-[#6EAA38]"></span>
      </div>
    </div>
  );
};

export default Input;
