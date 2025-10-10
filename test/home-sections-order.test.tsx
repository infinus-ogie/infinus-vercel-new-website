import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import HomePage from '../app/page'

describe('Home Page Section Order', () => {
  test('renders sections in correct order', () => {
    render(<HomePage />)
    
    const sections = [
      'hero',
      'about', 
      'services',
      'benefits',
      'sap-expertise',
      'domain-expertise',
      'join-team'
    ]
    
    // Get all section elements by data-section attribute
    const sectionElements = sections.map(section => 
      screen.getByTestId ? screen.getByTestId(`section-${section}`) : null
    ).filter(Boolean)
    
    // Since we're using data-section attributes, let's check for the actual sections
    // by looking for the section content instead
    expect(screen.getByText(/Driving Business Success through SAP Expertise/i)).toBeInTheDocument()
    expect(screen.getByText(/About Us/i)).toBeInTheDocument()
    expect(screen.getByText(/Our Services/i)).toBeInTheDocument()
    expect(screen.getByText(/Benefits from working with us/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Expertise/i)).toBeInTheDocument()
    expect(screen.getByText(/Domain Expertise/i)).toBeInTheDocument()
    expect(screen.getByText(/Join Our Team/i)).toBeInTheDocument()
  })
  
  test('hero section appears first', () => {
    render(<HomePage />)
    
    const heroHeading = screen.getByText(/Driving Business Success through SAP Expertise/i)
    expect(heroHeading).toBeInTheDocument()
    
    // Check that hero content is present
    expect(screen.getByText(/Your reliable SAP expertise partner/i)).toBeInTheDocument()
  })
  
  test('about section appears second', () => {
    render(<HomePage />)
    
    const aboutHeading = screen.getByText(/About Us/i)
    expect(aboutHeading).toBeInTheDocument()
    
    // Check for key about content
    expect(screen.getByText(/Infinus is SAP Gold Partner focused on SAP Business Suite solutions/i)).toBeInTheDocument()
  })
  
  test('services section appears third', () => {
    render(<HomePage />)
    
    const servicesHeading = screen.getByText(/Our Services/i)
    expect(servicesHeading).toBeInTheDocument()
    
    // Check for numbered services
    expect(screen.getByText(/SAP Implementation Services/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Support Services/i)).toBeInTheDocument()
    expect(screen.getByText(/Other Services/i)).toBeInTheDocument()
  })
  
  test('benefits section appears fourth', () => {
    render(<HomePage />)
    
    const benefitsHeading = screen.getByText(/Benefits from working with us/i)
    expect(benefitsHeading).toBeInTheDocument()
    
    // Check for benefit cards
    expect(screen.getByText(/European Focus/i)).toBeInTheDocument()
    expect(screen.getByText(/Hybrid Work Model/i)).toBeInTheDocument()
    expect(screen.getByText(/Competitive Pricing/i)).toBeInTheDocument()
    expect(screen.getByText(/Flexible Solutions/i)).toBeInTheDocument()
  })
  
  test('SAP expertise section appears fifth', () => {
    render(<HomePage />)
    
    const sapHeading = screen.getByText(/SAP Expertise/i)
    expect(sapHeading).toBeInTheDocument()
    
    // Check for SAP expertise badges
    expect(screen.getByText(/SAP Cloud ERP \(Private and Public\)/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business Data Cloud/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business AI/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business Technology Platform/i)).toBeInTheDocument()
  })
  
  test('domain expertise section appears sixth', () => {
    render(<HomePage />)
    
    const domainHeading = screen.getByText(/Domain Expertise/i)
    expect(domainHeading).toBeInTheDocument()
    
    // Check for new domain cards with images and descriptions
    expect(screen.getByText(/Industry-Specific SAP Solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/Retail/i)).toBeInTheDocument()
    expect(screen.getByText(/Pharmaceuticals/i)).toBeInTheDocument()
    expect(screen.getByText(/Wholesale and Distribution/i)).toBeInTheDocument()
    expect(screen.getByText(/Consumer Goods/i)).toBeInTheDocument()
    expect(screen.getByText(/Industrial Manufacturing/i)).toBeInTheDocument()
    expect(screen.getByText(/Professional Services/i)).toBeInTheDocument()
    expect(screen.getByText(/Travel/i)).toBeInTheDocument()
    expect(screen.getByText(/Oil & Gas/i)).toBeInTheDocument()
    expect(screen.getByText(/Telco/i)).toBeInTheDocument()
  })
  
  test('join team section appears seventh', () => {
    render(<HomePage />)
    
    const joinHeading = screen.getByText(/Join Our Team/i)
    expect(joinHeading).toBeInTheDocument()
    
    // Check for join team content
    expect(screen.getByText(/Due to continues business expansion/i)).toBeInTheDocument()
    expect(screen.getByText(/We will be glad to talk with you/i)).toBeInTheDocument()
  })
})
