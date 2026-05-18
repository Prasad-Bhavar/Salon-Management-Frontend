import Input from "./input/InputField";

interface InputTextProps {
  name: string;
  label: string;
  type?: string;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;

  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;

  error?: string;
  touched?: boolean;
  isTextArea?: boolean;
  disabled?: boolean;
  rightIcon?: React.ReactNode;
}

export default function InputText({
  name,
  label,
  type = "text",
  placeholder,
  className,
  value,
  onChange,
  onBlur,
  error,
  touched,
  min,
  max,
  isTextArea = false,
  disabled = false,
  rightIcon
}: InputTextProps) {

  const showError = touched && error;

  return (
    <div className="w-full relative">
      <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        className={className}
        onChange={onChange}
        onBlur={onBlur}
        error={!!showError}
        hint={showError ? error : undefined}
        isTextArea={isTextArea}
        min={min}
        max={max}
        disabled={disabled}
      />
      {rightIcon && (
        <span
          className={`absolute right-3 cursor-pointer z-50 
    ${showError ? "top-[45%]" : "top-1/2 -translate-y-[-25%]"}`}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
}