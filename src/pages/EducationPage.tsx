import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const education = [
  {
    school: 'Self-Taught Developer',
    field: 'Self-improvement',
    start: '2019',
    end: '2022',
    location: '',
  },
  {
    school: 'HTL Eisenstadt',
    field: 'Mechanical Engineering & Self-improvement in Programming',
    start: '2023',
    end: '2024',
    location: 'Eisenstadt, Austria',
  },
  {
    school: 'HTL Spengergasse Vienna',
    field: 'Network Engineering, Sysadmin, Programming',
    start: '2024',
    end: 'Present',
    location: 'Vienna, Austria',
  },
];

export default function EducationPage() {
  return (
    <div className="page-content">
      <div className="max-w-md mx-auto px-5 sm:px-4 py-6 sm:py-8">
        <div className="glass p-4 sm:p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GraduationCap size={22} className="text-accent" />
            <h2 className="text-lg font-bold text-foreground">Education</h2>
          </div>

          <div className="relative">
            {/* connecting line */}
            <div className="absolute left-[5px] top-3 bottom-3 w-px bg-white/10" />

            <div className="space-y-4 sm:space-y-5">
              {education.map((entry, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-accent z-10" />
                  <p className="text-sm sm:text-base font-semibold text-foreground">{entry.school}</p>
                  <p className="text-xs sm:text-sm text-secondary">{entry.field}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {entry.start} — {entry.end}
                    </span>
                    {entry.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {entry.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
