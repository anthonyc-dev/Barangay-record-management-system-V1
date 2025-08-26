import React from "react";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.013712332776!2d124.123456789!3d7.9123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3255e7b1b2c3d4e5%3A0xabcdef1234567890!2sSimpak%2C%20Lala%2C%20Lanao%20del%20Norte!5e0!3m2!1sen!2sph!4v1718000000000!5m2!1sen!2sph";

const Map: React.FC = () => {
  return (
    <section
      className="
        flex flex-col items-center py-20
        rounded-3xl 
        p-8 my-8 mx-auto max-w-3xl
        sm:max-w-4xl md:max-w-5xl
      "
    >
      <h2
        className="
          text-3xl sm:text-4xl font-bold text-slate-800 mb-4 tracking-tight
        "
      >
        Map of Simpak, Lala, Lanao del Norte
      </h2>
      <div
        className="
          w-full max-w-3xl aspect-video
          rounded-2xl overflow-hidden
          shadow-lg border-2 border-indigo-200
        "
      >
        <iframe
          title="Simpak, Lala, Lanao del Norte Map"
          src={MAP_EMBED_URL}
          className="w-full h-full min-h-[400px] border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <p
        className="
          mt-6 text-slate-500 text-base text-center max-w-2xl
        "
      >
        Explore the modern map of Simpak, Lala, Lanao del Norte. Use the
        controls to zoom and navigate the area.
      </p>
    </section>
  );
};

export default Map;
