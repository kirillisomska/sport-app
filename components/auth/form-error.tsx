interface FormErrorProps {
  message: string | undefined;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message || !message.length) return <></>;

  return (
    <div className="w-full rounded-md bg-red-500 bg-opacity-70 p-3 text-white">
      {message}
    </div>
  );
};

export default FormError;
