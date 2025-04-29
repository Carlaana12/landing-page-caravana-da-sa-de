import React from 'react';
import AdCarousel from '@/components/AdCarousel';
import EventsPreview from '@/components/EventsPreview';
import DoctorSearch from '@/components/DoctorSearch';
import NewsSection from '@/components/NewsSection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import DoctorGrid from '@/components/DoctorGrid';
import PodcastSection from '@/components/PodcastSection';
import PromotionalSections from '@/components/PromotionalSections';
import BlogSection from '@/components/BlogSection';
import FeatureHighlights from '@/components/FeatureHighlights';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <AdCarousel />
      <div className="max-w-7xl mx-auto px-4 space-y-16 py-8">
        <DoctorSearch />
        <FeatureHighlights />
        <DoctorGrid />
        <BlogSection />
        <PodcastSection />
        <EventsPreview />
        <NewsSection />
        <PromotionalSections />
        <CTASection />
        <PartnersSection />
        <ContactSection />
        <FAQSection />
      </div>
    </div>
  );
};

export default Home;