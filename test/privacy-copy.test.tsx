import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import PrivacyPage from '../app/(site)/privacy/page'

describe('Privacy Policy Content Match', () => {
  test('contains key privacy policy text', () => {
    render(<PrivacyPage />)
    
    const privacyText = screen.getByTestId ? screen.getByTestId('privacy-content')?.textContent : document.body.textContent
    
    // Test for key phrases from privacy policy
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument()
    expect(screen.getByText(/Introduction/i)).toBeInTheDocument()
    expect(screen.getByText(/Information We Collect/i)).toBeInTheDocument()
    expect(screen.getByText(/How We Use Your Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Data Security/i)).toBeInTheDocument()
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument()
  })
  
  test('contains specific privacy policy content', () => {
    render(<PrivacyPage />)
    
    // Test for specific content sections
    expect(screen.getByText(/Infinus \("we," "our," or "us"\) is committed to protecting your privacy/i)).toBeInTheDocument()
    expect(screen.getByText(/Personal Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Automatically Collected Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Information Sharing and Disclosure/i)).toBeInTheDocument()
    expect(screen.getByText(/Cookies and Tracking Technologies/i)).toBeInTheDocument()
    expect(screen.getByText(/Your Rights/i)).toBeInTheDocument()
    expect(screen.getByText(/Third-Party Links/i)).toBeInTheDocument()
    expect(screen.getByText(/Children's Privacy/i)).toBeInTheDocument()
    expect(screen.getByText(/Changes to This Privacy Policy/i)).toBeInTheDocument()
  })
  
  test('contains correct contact information', () => {
    render(<PrivacyPage />)
    
    // Test for correct contact information
    expect(screen.getByText(/office@infinus\.rs/i)).toBeInTheDocument()
    expect(screen.getByText(/Infinus d\.o\.o\., Tresnjinog cveta 1, 11070 Belgrade, Serbia/i)).toBeInTheDocument()
  })
  
  test('contains privacy policy structure', () => {
    render(<PrivacyPage />)
    
    // Test for main headings
    expect(screen.getByText(/Introduction/i)).toBeInTheDocument()
    expect(screen.getByText(/Information We Collect/i)).toBeInTheDocument()
    expect(screen.getByText(/How We Use Your Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Information Sharing and Disclosure/i)).toBeInTheDocument()
    expect(screen.getByText(/Data Security/i)).toBeInTheDocument()
    expect(screen.getByText(/Cookies and Tracking Technologies/i)).toBeInTheDocument()
    expect(screen.getByText(/Your Rights/i)).toBeInTheDocument()
    expect(screen.getByText(/Third-Party Links/i)).toBeInTheDocument()
    expect(screen.getByText(/Children's Privacy/i)).toBeInTheDocument()
    expect(screen.getByText(/Changes to This Privacy Policy/i)).toBeInTheDocument()
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument()
  })
  
  test('contains privacy policy key phrases', () => {
    render(<PrivacyPage />)
    
    // Test for key phrases that should be present
    const keyPhrases = [
      'privacy policy',
      'data protection',
      'personal information',
      'information we collect',
      'how we use',
      'data security',
      'your rights',
      'contact us'
    ]
    
    keyPhrases.forEach(phrase => {
      expect(screen.getByText(new RegExp(phrase, 'i'))).toBeInTheDocument()
    })
  })
})
