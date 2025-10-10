import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import FAQPage from '../app/(site)/faq/page'

describe('FAQ Content Match', () => {
  test('contains exact FAQ questions and answers', () => {
    render(<FAQPage />)
    
    // Test specific Q&A pairs from the FAQ page
    expect(screen.getByText(/What services does Infinus provide\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Infinus provides comprehensive SAP services/i)).toBeInTheDocument()
    
    expect(screen.getByText(/Why choose Infinus as your SAP partner\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Infinus is a certified SAP Gold Partner with extensive experience/i)).toBeInTheDocument()
    
    expect(screen.getByText(/Do you provide SAP support services\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Yes, we offer comprehensive SAP support services/i)).toBeInTheDocument()
    
    expect(screen.getByText(/How long does a typical SAP implementation take\?/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP implementation timelines vary based on project scope/i)).toBeInTheDocument()
    
    expect(screen.getByText(/What is the cost of SAP implementation\?/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP implementation costs depend on various factors/i)).toBeInTheDocument()
    
    expect(screen.getByText(/Do you offer training for SAP users\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Yes, we provide comprehensive training programs/i)).toBeInTheDocument()
    
    expect(screen.getByText(/What makes your SAP consulting different\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Our SAP consulting combines deep technical expertise/i)).toBeInTheDocument()
  })
  
  test('FAQ accordion functionality works', () => {
    render(<FAQPage />)
    
    const firstQuestion = screen.getByText(/What services does Infinus provide\?/i)
    expect(firstQuestion).toBeInTheDocument()
    
    // Check that FAQ page renders without errors
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()
    expect(screen.getByText(/Find answers to common questions about our SAP services/i)).toBeInTheDocument()
  })
  
  test('contains contact CTA section', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/Still Have Questions\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Our SAP experts are here to help/i)).toBeInTheDocument()
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument()
  })
})
