'use client';
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import Section from '@/components/UI/Section';
import Testimonials from '@/components/UI/Testimonials';

const TestimonialsPage: React.FC = () => {
  // Mock testimonials data based on the website
  const testimonials = [
    {
      id: 1,
      name: "Mayana",
      country: "Indonesia",
      year: "2025",
      program: "Istanbul Youth Summit 2025",
      testimonial: "I hope that through Istanbul Youth Summit, everyone will create many new memories, make great friends, and gain unforgettable experiences just like I did. I'm truly grateful for this amazing opportunity to connect with youth from around the world and learn about different cultures while working on meaningful projects together.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1749564237.jpg"
    },
    {
      id: 2,
      name: "Ethan Christopher",
      country: "Indonesia",
      year: "2024",
      program: "Istanbul Youth Summit 2024",
      testimonial: "My name is Ethan Christopher, and I am from Indonesia. I was a participant in IYS 2024 and won awards in the categories of 'Best Project Group,' 'Most Active Group,' and 'Best Essay.' This experience has been transformational, allowing me to develop leadership skills and create lasting international friendships.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1747973884.jpg",
      award: "Best Project Group Winner"
    },
    {
      id: 3,
      name: "Iklima Umi Kultsum",
      country: "Indonesia",
      year: "2022",
      program: "Istanbul Youth Summit 2022",
      testimonial: "Joining IYS was the greatest experience I had during my university years. Being one of the hundreds of delegates at this international event allowed me to build global connections, enhance my leadership capabilities, and gain perspectives on addressing global challenges through youth-led initiatives.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1747973970.jpg"
    },
    {
      id: 4,
      name: "Mutugi Mbaabu",
      country: "Kenya",
      year: "2024",
      program: "Istanbul Youth Summit 2024",
      testimonial: "My journey with Youth Break the Boundaries has been truly amazing. The summit and the people were incredibly welcoming and humble. I'm starting a new chapter in my life filled with opportunities to make meaningful contributions to society while building an international network of changemakers.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1747974037.jpg"
    },
    {
      id: 5,
      name: "Rian Rendi",
      country: "Indonesia",
      year: "2024",
      program: "Istanbul Youth Summit 2024",
      testimonial: "The Istanbul Youth Summit was an amazing event for me, it gave me the valuable experience of meeting amazing young people from all over the world, and the feeling of being able to voice my opinions and ideas on global issues. It's an experience I'll treasure forever.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1747974102.jpg"
    },
    {
      id: 6,
      name: "Siti Nada Faradisa",
      country: "Indonesia",
      year: "2024",
      program: "Istanbul Youth Summit 2024",
      testimonial: "Hello, I'm Siti Nada Faradisa from Aceh, Indonesia. I really enjoyed this event because the speakers were highly competent in their fields. It also helped me explore my potential and understand how I can contribute to solving global challenges through innovative approaches.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1747974193.jpg"
    },
    {
      id: 7,
      name: "Zidny Ilma",
      country: "Indonesia",
      year: "2024",
      program: "Istanbul Youth Summit 2024",
      testimonial: "Alhamdulillah, I have gained so many valuable experiences, one of which is the opportunity to speak and engage in discussions with incredible people. Additionally, I had the chance to learn about different cultures and perspectives while working on projects that can create real social impact.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1747974261.jpg"
    },
    {
      id: 8,
      name: "Zulfa Ilma Nuriana",
      country: "Indonesia",
      year: "2020",
      program: "Istanbul Youth Summit 2020",
      testimonial: "Hello, I am Zulfa Ilma Nuriana from Indonesia. After participating in the Istanbul Youth Summit 2020, I have had more opportunities to speak in public. My network has expanded, and I've gained confidence in my ability to lead and inspire others in my community.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1747974319.jpg"
    },
    {
      id: 9,
      name: "Muhammad Fathazam",
      country: "Indonesia",
      year: "2025",
      program: "Istanbul Youth Summit 2025",
      testimonial: "It is my first time joining Istanbul Youth Summit. After three remarkable days, I hope this experience will have a lasting impact on me. It inspired me to become a more empowered changemaker and taught me the importance of collaboration in addressing global challenges.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1749555581.jpg"
    },
    {
      id: 10,
      name: "Hector",
      country: "Taiwan",
      year: "2025",
      program: "Istanbul Youth Summit 2025",
      testimonial: "I really like our project because it focuses not only on the idea but also on strong management to ensure its success. The experience has been very rewarding and enjoyable. Our goal is to create sustainable impact that extends beyond the summit itself.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1749557679.jpg"
    },
    {
      id: 11,
      name: "Aufan Khafifar",
      country: "Indonesia",
      year: "2025",
      program: "Istanbul Youth Summit 2025",
      testimonial: "Thanks to Istanbul Youth Summit, I became brave enough to speak in front of people. My English improved a lot, and I was able to have conversations with friends from different countries. This program has given me confidence and global perspective I never had before.",
      image: "https://storage.ybbfoundation.com/program-testimonies/1/1749563100.jpg"
    },
    {
      id: 12,
      name: "Sarah Johnson",
      country: "United States",
      year: "2024",
      program: "Istanbul Youth Summit 2024",
      testimonial: "Participating in IYS was a life-changing experience. The program structure, the diversity of participants, and the quality of sessions exceeded my expectations. I've built connections that continue to inspire my work in social entrepreneurship back home."
    },
    {
      id: 13,
      name: "Ahmed Al-Rashid",
      country: "UAE",
      year: "2023",
      program: "Istanbul Youth Summit 2023",
      testimonial: "The Istanbul Youth Summit provided me with a platform to share my ideas about sustainable development in the Middle East. The feedback and collaboration opportunities were invaluable for refining my project and expanding its reach.",
      award: "Most Innovative Project"
    },
    {
      id: 14,
      name: "Maria Santos",
      country: "Brazil",
      year: "2024",
      program: "Istanbul Youth Summit 2024",
      testimonial: "As a young leader from Latin America, IYS opened my eyes to global perspectives on social innovation. The workshops on leadership and the networking sessions helped me understand how to scale my environmental project internationally."
    },
    {
      id: 15,
      name: "Kwame Asante",
      country: "Ghana",
      year: "2023",
      program: "Istanbul Youth Summit 2023",
      testimonial: "The summit was more than just presentations and workshops – it was about building a global community of young changemakers. The friendships I made and the mentorship I received continue to guide my work in education reform in Africa."
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h1 className="display-5 fw-bold mb-3">Testimonials</h1>
        <p className="lead mb-0">
          Hear from our community of young leaders who have experienced transformational growth through our programs
        </p>
      </Section>

      {/* Testimonials */}
      <Section padding="xl">
        <Testimonials
          testimonials={testimonials}
          showSearch={true}
          showFilters={true}
          itemsPerPage={9}
          className="fade-in-up"
        />
      </Section>

      {/* Impact Stats */}
      <Section background="light" padding="lg">
        <div className="text-center">
          <h3 className="mb-4">Join Our Growing Community</h3>
          <div className="row g-4">
            <div className="col-md-3 col-6">
              <div className="text-center">
                <h2 className="text-primary mb-2">4,000+</h2>
                <p className="text-muted mb-0">Alumni Worldwide</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center">
                <h2 className="text-success mb-2">120+</h2>
                <p className="text-muted mb-0">Countries Represented</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center">
                <h2 className="text-warning mb-2">95%</h2>
                <p className="text-muted mb-0">Satisfaction Rate</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center">
                <h2 className="text-info mb-2">500+</h2>
                <p className="text-muted mb-0">Social Projects</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h3 className="mb-4">Ready to Create Your Own Success Story?</h3>
        <p className="lead mb-4">
          Join thousands of young leaders who have transformed their lives and communities through our programs.
        </p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <a href="/apply" className="btn btn-light btn-lg">
            <i className="ri-user-add-line me-2"></i>
            Apply Now
          </a>
          <a href="/programs" className="btn btn-outline-light btn-lg">
            <i className="ri-information-line me-2"></i>
            Learn More
          </a>
        </div>
      </Section>
    </PublicLayout>
  );
};

export default TestimonialsPage;