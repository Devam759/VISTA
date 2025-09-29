import Link from "next/link";

export default function Card({ title, subtitle, children, href }) {
  const Wrapper = ({ children }) => href ? (
    <Link href={href} className="block rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-white transition-all duration-300 ease-out p-6 group">
      {children}
    </Link>
  ) : (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
      {children}
    </div>
  );

  return (
    <Wrapper>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {title ? <h3 className="font-semibold text-lg tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{title}</h3> : null}
          {href && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
        {subtitle ? <span className="text-xs text-gray-500 font-medium group-hover:text-blue-500 transition-colors duration-300">{subtitle}</span> : null}
      </div>
      {children}
    </Wrapper>
  );
}


