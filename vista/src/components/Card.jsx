export default function Card({ title, subtitle, children, href }) {
  const Wrapper = ({ children }) => href ? (
    <a href={href} className="block rounded-xl bg-white shadow-sm p-5 hover:shadow-md transition-shadow">
      {children}
    </a>
  ) : (
    <div className="rounded-xl bg-white shadow-sm p-5">
      {children}
    </div>
  );

  return (
    <Wrapper>
      <div className="flex items-center justify-between mb-2">
        {title ? <h3 className="font-semibold text-[15px]">{title}</h3> : null}
        {subtitle ? <span className="text-xs text-foreground/55">{subtitle}</span> : null}
      </div>
      {children}
    </Wrapper>
  );
}


