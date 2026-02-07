const Systems = () => {
  return (
    <section className="py-24 bg-[#0B0F19] text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT — TEXT CONTENT */}
        <div>
          <h2 className="text-5xl font-bold mb-10 tracking-tight">
            What I Build & Work With
          </h2>

          <div className="space-y-8 text-gray-300 text-lg leading-relaxed">

            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Cloud-Native Kubernetes Systems
              </h3>
              <p>
                I design Kubernetes-based microservices environments that simulate
                real production behavior under load and failure, focusing on
                predictable system behavior rather than basic working demos.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Cloud Infrastructure (AWS)
              </h3>
              <p>
                I build infrastructure close to the cluster and network layers,
                preferring controlled environments over managed shortcuts.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                CI/CD & Delivery Systems
              </h3>
              <p>
                I design deterministic delivery paths that build, containerize,
                test, and deploy applications with reproducible outcomes.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Infrastructure as Code
              </h3>
              <p>
                I model infrastructure as repeatable systems using declarative
                design rather than manual provisioning.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT — VISUAL ANCHOR */}
        <div className="relative border border-gray-800 rounded-xl p-6 text-gray-400 text-sm leading-relaxed">
          <div className="absolute -top-3 left-4 bg-[#0B0F19] px-3 text-xs tracking-wide text-gray-500">
            SYSTEM LAYERS
          </div>

          <ul className="space-y-3">
            <li>Linux & OS internals</li>
            <li>Networking & traffic flow</li>
            <li>Containers & image lifecycle</li>
            <li>Kubernetes scheduling & control plane</li>
            <li>Cloud primitives & infrastructure design</li>
            <li>CI/CD pipelines & release flow</li>
            <li>Observability & failure analysis</li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default Systems;
