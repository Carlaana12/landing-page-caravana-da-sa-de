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
    <div className="min-h-screen overflow-x-hidden">
      <div className="md:w-screen md:relative md:left-1/2 md:right-1/2 md:-ml-[50vw] md:mr-[50vw] md:max-w-none">
        <AdCarousel />
      </div>
      <div className="max-w-7xl mx-auto px-4 space-y-16 py-8 md:ml-[240px]">
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