export default function Button({
  children,
  type = "button",
  variant = "primary",
  ...props
}) {
  const className =
    variant === "outline" ? "btn btn-outline" : "btn btn-primary";

  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}