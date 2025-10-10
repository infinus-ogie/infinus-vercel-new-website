import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface FAQItemProps {
  question: string
  answer: string
  value: string
}

export function FAQItem({ question, answer, value }: FAQItemProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-left">
        {question}
      </AccordionTrigger>
      <AccordionContent>
        <div className="prose prose-sm max-w-none">
          <p>{answer}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
