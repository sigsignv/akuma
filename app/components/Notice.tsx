type NoticeProps = {
  children: React.ReactNode;
};

export default function Notice({ children }: NoticeProps) {
  return (
    <div className="flex justify-center items-center">
      <p className="m-4">{children}</p>
    </div>
  );
}
