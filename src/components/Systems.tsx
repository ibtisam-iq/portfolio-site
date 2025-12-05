const Systems = () => {
  return (
    <section className="px-10 pt-10 pb-20 bg-[#0B0F19] text-white">
      <h2 className="text-5xl font-bold mb-10 tracking-tight">
        What I Build & Work With
      </h2>

      <div className="max-w-5xl space-y-10 text-gray-400 text-lg leading-relaxed">

        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Cloud-Native Kubernetes Systems
          </h3>
          <p>
            I design Kubernetes-based microservices environments that simulate real production behavior under load and failure, focusing on predictable system behavior rather than basic working demos.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Cloud Infrastructure (AWS)
          </h3>
          <p>
            I build infrastructure close to the cluster and network layers, preferring controlled environments over managed shortcuts.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            CI/CD & Delivery Systems
          </h3>
          <p>
            I design deterministic delivery paths that build, containerize, test, and deploy applications with reproducible outcomes.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Infrastructure as Code
          </h3>
          <p>
            I model infrastructure as repeatable systems using declarative design rather than manual provisioning.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Systems;