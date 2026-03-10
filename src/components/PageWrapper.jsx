// This component wraps page content to account for the fixed navbar
const PageWrapper = ({ children, className = "" }) => {
  return <div className={`pt-16 ${className}`}>{children}</div>;
};

export default PageWrapper;
