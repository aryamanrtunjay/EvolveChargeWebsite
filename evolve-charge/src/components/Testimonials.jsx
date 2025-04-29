import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The EVolve Charger has made charging my EV so much easier. I love the automated features!",
      author: "John D."
    },
    {
      quote: "I was impressed by how simple the installation process was. The app is also very intuitive.",
      author: "Sarah M."
    },
    {
      quote: "Customer support was fantastic when I had questions. They really care about their users.",
      author: "Mike R."
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section id="testimonials" className="relative py-6 md:py-24 bg-gray-50">
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-teal-50 to-transparent rounded-br-full opacity-70"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Hear from EV owners who love using the EVolve Charger</p>
        </div>

        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <p className="text-gray-700 italic">{testimonial.quote}</p>
                <p className="mt-4 font-semibold text-gray-900">- {testimonial.author}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;