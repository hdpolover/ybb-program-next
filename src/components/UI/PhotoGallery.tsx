'use client';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Button, Badge, Modal, ModalHeader, ModalBody } from 'reactstrap';

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
  year: string;
  description?: string;
  type: 'image' | 'video';
  videoUrl?: string;
}

interface PhotoGalleryProps {
  items: GalleryItem[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  itemsPerPage?: number;
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  items,
  title = "Photo Gallery",
  subtitle = "Discover visual highlights from our various programs",
  showFilters = true,
  itemsPerPage = 12,
  className = ''
}) => {
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>(items);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories and years
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  const years = ['all', ...Array.from(new Set(items.map(item => item.year))).sort().reverse()];

  // Filter items based on selected filters
  useEffect(() => {
    let filtered = items;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === selectedYear);
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [selectedCategory, selectedYear, items]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const openLightbox = (item: GalleryItem) => {
    setLightboxItem(item);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
    setIsLightboxOpen(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightboxItem) return;

    const currentIndex = filteredItems.findIndex(item => item.id === lightboxItem.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      newIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    }

    setLightboxItem(filteredItems[newIndex]);
  };

  return (
    <div className={`photo-gallery ${className}`}>
      {/* Header */}
      {title && (
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">{title}</h2>
          {subtitle && <p className="lead text-muted">{subtitle}</p>}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="gallery-filters mb-4">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex flex-wrap gap-2">
                <span className="fw-bold me-3">Category:</span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    color={selectedCategory === category ? 'primary' : 'outline-primary'}
                    onClick={() => setSelectedCategory(category)}
                    className="text-capitalize"
                  >
                    {category === 'all' ? 'All' : category.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                <span className="fw-bold me-3">Year:</span>
                {years.map((year) => (
                  <Button
                    key={year}
                    size="sm"
                    color={selectedYear === year ? 'success' : 'outline-success'}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year === 'all' ? 'All Years' : year}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Results count */}
      <div className="mb-3">
        <p className="text-muted">
          Showing {currentItems.length} of {filteredItems.length} items
          {selectedCategory !== 'all' || selectedYear !== 'all' ? 
            ` (filtered from ${items.length} total)` : ''}
        </p>
      </div>

      {/* Gallery Grid */}
      <Row className="g-4">
        {currentItems.map((item, index) => (
          <Col key={item.id} lg={3} md={4} sm={6}>
            <Card className="gallery-item h-100">
              <div className="gallery-image-wrapper position-relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="card-img-top gallery-image"
                  style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => openLightbox(item)}
                />
                <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div className="gallery-overlay-content text-center">
                    <Button
                      color="light"
                      size="sm"
                      className="rounded-circle"
                      onClick={() => openLightbox(item)}
                    >
                      <i className={item.type === 'video' ? 'ri-play-fill' : 'ri-eye-fill'}></i>
                    </Button>
                  </div>
                </div>
                {item.type === 'video' && (
                  <Badge color="danger" className="position-absolute top-0 start-0 m-2">
                    <i className="ri-video-line me-1"></i>
                    Video
                  </Badge>
                )}
              </div>
              <CardBody className="p-3">
                <h6 className="card-title mb-2">{item.title}</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <Badge color="primary" className="text-capitalize">
                    {item.category.replace('-', ' ')}
                  </Badge>
                  <small className="text-muted">{item.year}</small>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="ri-arrow-right-line"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        isOpen={isLightboxOpen}
        toggle={closeLightbox}
        size="lg"
        className="lightbox-modal"
        centered
      >
        <ModalHeader toggle={closeLightbox}>
          {lightboxItem?.title}
        </ModalHeader>
        <ModalBody className="p-0">
          {lightboxItem && (
            <div className="position-relative">
              {lightboxItem.type === 'video' && lightboxItem.videoUrl ? (
                <div className="ratio ratio-16x9">
                  <iframe
                    src={lightboxItem.videoUrl}
                    title={lightboxItem.title}
                    allowFullScreen
                    className="rounded"
                  ></iframe>
                </div>
              ) : (
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="img-fluid w-100"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              )}

              {/* Navigation buttons */}
              <button
                className="btn btn-primary position-absolute top-50 start-0 translate-middle-y ms-3"
                onClick={() => navigateLightbox('prev')}
                style={{ zIndex: 1050 }}
              >
                <i className="ri-arrow-left-line"></i>
              </button>
              <button
                className="btn btn-primary position-absolute top-50 end-0 translate-middle-y me-3"
                onClick={() => navigateLightbox('next')}
                style={{ zIndex: 1050 }}
              >
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          )}
          {lightboxItem?.description && (
            <div className="p-3">
              <p className="text-muted mb-0">{lightboxItem.description}</p>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PhotoGallery;