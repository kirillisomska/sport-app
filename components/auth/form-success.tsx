interface FormSuccessProps {
  message: string | undefined;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message || !message.length) return <></>;

  return (
    <div className="w-full rounded-md bg-opacity-70 bg-lime-700 p-3 text-white">
      {message}
    </div>
  );
};

export default FormSuccess;
