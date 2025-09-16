export default function Card({ title, subtitle, children, href }) {
  const Wrapper = ({ children }) => href ? (
    <a href={href} className="block rounded-2xl surface shadow-sm p-6 card-hover group">
      {children}
    </a>
  ) : (
    <div className="rounded-2xl surface shadow-sm p-6">
      {children}
    </div>
  );

  return (
    <Wrapper>
      <div className="flex items-center justify-between mb-3">
        {title ? <h3 className="font-semibold text-lg tracking-tight text-foreground group-hover:text-[color:var(--accent)] transition-colors">{title}</h3> : null}
        {subtitle ? <span className="text-xs text-foreground/60 font-medium">{subtitle}</span> : null}
      </div>
      {children}
    </Wrapper>
  );
}


