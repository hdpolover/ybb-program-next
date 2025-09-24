'use client';
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import Section from '@/components/UI/Section';
import PhotoGallery from '@/components/UI/PhotoGallery';

const GalleryPage: React.FC = () => {
  // Mock gallery data
  const galleryItems = [
    {
      id: 1,
      title: "Opening Ceremony 2025",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "ceremony",
      year: "2025",
      description: "Delegates gathering for the opening ceremony of Istanbul Youth Summit 2025",
      type: "image" as const
    },
    {
      id: 2,
      title: "Panel Discussion - Climate Action",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "sessions",
      year: "2025",
      description: "Youth leaders discussing SDG 13: Climate Action initiatives",
      type: "image" as const
    },
    {
      id: 3,
      title: "Networking Session",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "networking",
      year: "2025",
      description: "Participants connecting and sharing ideas during networking break",
      type: "image" as const
    },
    {
      id: 4,
      title: "Award Ceremony Highlights",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "ceremony",
      year: "2025",
      description: "Winners receiving recognition for outstanding social projects",
      type: "image" as const
    },
    {
      id: 5,
      title: "Workshop - Social Innovation",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "workshops",
      year: "2024",
      description: "Interactive workshop on developing social innovation projects",
      type: "image" as const
    },
    {
      id: 6,
      title: "Cultural Exchange Program",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "cultural",
      year: "2024",
      description: "Participants experiencing Istanbul's rich cultural heritage",
      type: "image" as const
    },
    {
      id: 7,
      title: "Team Building Activities",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "activities",
      year: "2024",
      description: "Collaborative activities building international friendships",
      type: "image" as const
    },
    {
      id: 8,
      title: "Project Presentations",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "presentations",
      year: "2024",
      description: "Delegates presenting their innovative social impact projects",
      type: "image" as const
    },
    {
      id: 9,
      title: "Summit Overview Video 2024",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "highlights",
      year: "2024",
      description: "Complete overview of Istanbul Youth Summit 2024 highlights",
      type: "video" as const,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 10,
      title: "Closing Ceremony 2024",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "ceremony",
      year: "2024",
      description: "Final moments and farewell from Istanbul Youth Summit 2024",
      type: "image" as const
    },
    {
      id: 11,
      title: "Speaker Session - Leadership",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "sessions",
      year: "2023",
      description: "Keynote session on youth leadership in the digital age",
      type: "image" as const
    },
    {
      id: 12,
      title: "Group Photo - All Participants",
      image: "https://storage.ybbfoundation.com/program-photos/1/1712164271.jpg",
      category: "group-photos",
      year: "2023",
      description: "Complete group photo of all Istanbul Youth Summit 2023 participants",
      type: "image" as const
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Section background="gradient" padding="lg" className="text-white text-center">
        <h1 className="display-5 fw-bold mb-3">Photo Gallery</h1>
        <p className="lead mb-0">
          Discover visual highlights from our various programs and memorable moments
        </p>
      </Section>

      {/* Gallery */}
      <Section padding="xl">
        <PhotoGallery
          items={galleryItems}
          showFilters={true}
          itemsPerPage={12}
          className="fade-in-up"
        />
      </Section>

      {/* Call to Action */}
      <Section background="light" padding="lg" className="text-center">
        <h3 className="mb-4">Want to be featured in our next gallery?</h3>
        <p className="lead text-muted mb-4">
          Join our upcoming Istanbul Youth Summit and become part of our inspiring community.
        </p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <a href="/apply" className="btn btn-primary btn-lg">
            <i className="ri-camera-line me-2"></i>
            Apply Now
          </a>
          <a href="/programs" className="btn btn-outline-primary btn-lg">
            <i className="ri-information-line me-2"></i>
            Learn More
          </a>
        </div>
      </Section>
    </PublicLayout>
  );
};

export default GalleryPage;