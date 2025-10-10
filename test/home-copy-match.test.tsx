import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import HomePage from '../app/page'

describe('Home Page Content Match', () => {
  test('contains exact hero text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Driving Business Success through SAP Expertise/i)).toBeInTheDocument()
    expect(screen.getByText(/Your reliable SAP expertise partner/i)).toBeInTheDocument()
  })
  
  test('contains exact about us text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/About Us/i)).toBeInTheDocument()
    expect(screen.getByText(/Infinus is SAP Gold Partner focused on SAP Business Suite solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Cloud ERP \(Private and Public\)/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business Data Cloud/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business AI/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business Technology Platform/i)).toBeInTheDocument()
    expect(screen.getByText(/Our experienced SAP consultants can bring high-quality expertise/i)).toBeInTheDocument()
    expect(screen.getByText(/The vast majority of our team consists of senior SAP consultants with 10\+ years of professional experience/i)).toBeInTheDocument()
  })
  
  test('contains exact services text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Our Services/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Implementation Services/i)).toBeInTheDocument()
    expect(screen.getByText(/Greenfield, brownfield, conversions, migrations and rollouts/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Support Services/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Application Management Services and SLA Support Services/i)).toBeInTheDocument()
    expect(screen.getByText(/Other Services/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP localisation support, developments, trainings, etc/i)).toBeInTheDocument()
  })
  
  test('contains exact benefits text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Benefits from working with us/i)).toBeInTheDocument()
    expect(screen.getByText(/European Focus/i)).toBeInTheDocument()
    expect(screen.getByText(/We are located in Serbia \(CET time zone\) and provide services throughout Europe/i)).toBeInTheDocument()
    expect(screen.getByText(/All our consultants are fluent in English and some of them in German as well/i)).toBeInTheDocument()
    expect(screen.getByText(/Hybrid Work Model/i)).toBeInTheDocument()
    expect(screen.getByText(/Our consultants are available for both onsite and remote work/i)).toBeInTheDocument()
    expect(screen.getByText(/Competitive Pricing/i)).toBeInTheDocument()
    expect(screen.getByText(/By sourcing with us, you can take advantage of cost-effective services without sacrificing quality/i)).toBeInTheDocument()
    expect(screen.getByText(/Flexible Solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/We offer flexible engagement models tailored to your unique needs and challenges/i)).toBeInTheDocument()
  })
  
  test('contains SAP expertise items', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/SAP Expertise/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Cloud ERP \(Private and Public\)/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business Data Cloud/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business AI/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business Technology Platform/i)).toBeInTheDocument()
  })
  
  test('contains domain expertise items', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Domain Expertise/i)).toBeInTheDocument()
    expect(screen.getByText(/Industry-Specific SAP Solutions/i)).toBeInTheDocument()
    
    const domains = [
      'Retail',
      'Pharmaceuticals', 
      'Wholesale and Distribution',
      'Consumer Goods',
      'Industrial Manufacturing',
      'Professional Services',
      'Travel',
      'Oil & Gas',
      'Telco'
    ]
    
    domains.forEach(domain => {
      expect(screen.getByText(new RegExp(domain, 'i'))).toBeInTheDocument()
    })
  })
  
  test('contains join team section with exact text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Join Our Team/i)).toBeInTheDocument()
    expect(screen.getByText(/Due to continues business expansion, we are looking to expand our team/i)).toBeInTheDocument()
    expect(screen.getByText(/If you have experience in some of SAP S\/4HANA or ECC modules and areas/i)).toBeInTheDocument()
    expect(screen.getByText(/We will be glad to talk with you/i)).toBeInTheDocument()
  })
  
  test('contains contact form with exact fields', () => {
    render(<HomePage />)
    
    // Check for form fields
    expect(screen.getByLabelText(/Your Name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Attach your Resume/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })
})
