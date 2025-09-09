import { ArrowRight } from 'lucide-react';

function LigaHeader({ info }) {
  if (!info) {
    return null;
  }

  return (
    <div className="flex items-center gap-2.5 lg:gap-4">
      <div className="relative flex min-h-10 min-w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.25)] p-1 lg:min-h-12 lg:min-w-12">
        <img
          src={info.strBadge}
          alt={`Logo da ${info.strLeague}`}
          className="size-7.5 lg:size-9 object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold lg:text-lg">{info.strLeague}</p>
        <p className="lg:text-base text-sm text-gray-600">{info.strCountry}</p>
      </div>
    </div>
  );
}

export default LigaHeader;