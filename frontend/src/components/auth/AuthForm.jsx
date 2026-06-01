/**
 * Shared wrapper for Login and Register forms.
 * Provides a centered card layout with a title and subtitle.
 */
const AuthForm = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>}
        </div>
        <div className="card shadow-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthForm;
