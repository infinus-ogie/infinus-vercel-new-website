import { FeatureSteps } from "@/components/ui/feature-section"

const benefitsFeatures = [
  { 
    step: 'Benefit 1', 
    title: 'European Focus',
    content: 'We are located in Serbia (CET time zone) and provide services throughout Europe. All our consultants are fluent in English and some of them in German as well.', 
    iconName: 'globe'
  },
  { 
    step: 'Benefit 2',
    title: 'Hybrid Work Model',
    content: 'Our consultants are available for both onsite and remote work, giving you the flexibility to choose the option that works best for you.',
    iconName: 'users'
  },
  { 
    step: 'Benefit 3',
    title: 'Competitive Pricing',
    content: 'By sourcing with us, you can take advantage of cost-effective services without sacrificing quality.',
    iconName: 'dollarSign'
  },
  { 
    step: 'Benefit 4',
    title: 'Flexible Solutions',
    content: 'We offer flexible engagement models tailored to your unique needs and challenges, whether you need short-term support or long-term solutions.',
    iconName: 'settings'
  },
]

export function BenefitsFeatureSteps() {
  return (
      <FeatureSteps 
        features={benefitsFeatures}
        title="Benefits from working with us"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
  )
}
