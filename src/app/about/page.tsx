export default function About() {
  const stats = [
    { label: 'Height', value: '175 cm' },
    { label: 'Bust', value: '84 cm' },
    { label: 'Waist', value: '60 cm' },
    { label: 'Hips', value: '89 cm' },
    { label: 'Shoe Size', value: '39 EU' },
    { label: 'Hair Color', value: 'Brown' },
    { label: 'Eye Color', value: 'Green' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Bio Section */}
      <section>
        <h1 className="text-3xl font-bold mb-6">About Me</h1>
        <div className="prose lg:prose-lg">
          <p className="text-gray-600">
            Professional model with over 5 years of experience in fashion, commercial, and editorial modeling. 
            Based in Sofia, Bulgaria, but available for international assignments.
          </p>
          <p className="text-gray-600">
            I've had the pleasure of working with numerous renowned brands and photographers, 
            participating in fashion weeks across Europe, and appearing in various international magazines.
          </p>
        </div>
      </section>

      {/* Stats/Measurements */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Measurements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="text-gray-600">{stat.label}</dt>
              <dd className="text-xl font-semibold">{stat.value}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Experience</h2>
        <div className="space-y-6">
          <div className="border-l-4 border-gray-200 pl-4">
            <h3 className="font-semibold">Sofia Fashion Week</h3>
            <p className="text-gray-600">Runway Model - 2023</p>
          </div>
          <div className="border-l-4 border-gray-200 pl-4">
            <h3 className="font-semibold">Vogue Bulgaria</h3>
            <p className="text-gray-600">Editorial Feature - 2022</p>
          </div>
          <div className="border-l-4 border-gray-200 pl-4">
            <h3 className="font-semibold">Major Brand Campaign</h3>
            <p className="text-gray-600">Lead Model - 2021</p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {['Runway', 'Editorial', 'Commercial', 'Print', 'Swimwear', 'Lifestyle'].map((skill) => (
            <div key={skill} className="bg-gray-100 rounded-lg px-4 py-2 text-center">
              {skill}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}