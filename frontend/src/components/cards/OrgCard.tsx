import type {Org as Organization} from '../../api/orgs';
import LogoPlaceholder from '../../assets/LogoPlaceholder';

type OrgCardProps = {
  org: Organization,
  onClick: () => void,
  idx: number,
}

export function OrgTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block py-0.75 px-2.25 rounded-full text-[10.5px] font-bold tracking-[0.8px] uppercase bg-line text-primary font-body">
      {children}
    </span>
  )
}

export default function OrgCard({ org, onClick, idx }: OrgCardProps) {
  return (
    <div
      onClick={onClick}
      className="cf-card-hover bg-white border border-gray-200 rounded-md p-5 cursor-pointer flex gap-4 items-start"
      style={{ animation: `cf-stagger .35s ease ${idx * 0.04}s both` }}
    >
      <LogoPlaceholder size={72} />
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 flex-wrap mb-2.5">
        {(org.tags ?? []).map((t) => <OrgTag key={t}>{t}</OrgTag>)}
      </div>
        <h3 className="font-sans text-lg font-bold text-gray-900 mb-1 leading-tight">{org.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{org.blurb}</p>
      </div>
    </div>
  );
}