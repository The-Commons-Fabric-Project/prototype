import type {Org as Organization} from '../../types/orgs';
import LogoPlaceholder from '../../assets/LogoPlaceholder';

type OrgCardProps = {
  org: Organization,
  onClick: (args: any) => void,
  idx: number,
}

export default function OrgCard({ org, onClick, idx }: OrgCardProps) {
  return (
    <div
      onClick={onClick}
      className="cf-card-hover bg-white border border-gray-200 rounded-md p-5 cursor-pointer flex gap-4 items-start"
      style={{ animation: `cf-stagger .35s ease ${idx * 0.04}s both` }}
    >
      {/* <div className="flex-shrink-0 rounded-full bg-gray-100" style={{ width: 72, height: 72 }} /> */}
      <LogoPlaceholder size={72} />
      <div className="flex-1 min-w-0">
        <h3 className="font-sans text-lg font-bold text-gray-900 mb-1 leading-tight">{org.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{org.blurb}</p>
      </div>
    </div>
  );
}