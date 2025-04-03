import React from 'react';
import AdCarousel from '@/components/AdCarousel';
import EventsPreview from '@/components/EventsPreview';
import DoctorSearch from '@/components/DoctorSearch';
import NewsSection from '@/components/NewsSection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import DoctorGrid from '@/components/DoctorGrid';
import PodcastSection from '@/components/PodcastSection';
import FeaturedServices from '@/components/FeaturedServices';
import PromotionalSections from '@/components/PromotionalSections';
import BlogSection from '@/components/BlogSection';
import TestimonialSection from '@/components/TestimonialSection';
import StatisticsSection from '@/components/StatisticsSection';
import FeatureHighlights from '@/components/FeatureHighlights';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import PartnerLogos from '@/components/PartnerLogos';

const Home = () => {
  return (
    <div className="min-h-screen">
      <AdCarousel />
      <div className="max-w-7xl mx-auto px-4 space-y-16 py-8">
        <DoctorSearch />
        <FeatureHighlights />
        <DoctorGrid />
        <StatisticsSection />
        <FeaturedServices />
        <TestimonialSection />
        <BlogSection />
        <PodcastSection />
        <EventsPreview />
        <NewsSection />
        <PartnerLogos />
        <FAQSection />
        <PromotionalSections />
        <CTASection />
        <PartnersSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Home;